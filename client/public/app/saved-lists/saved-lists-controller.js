angular.module('wtf.saved-lists', ['ui.materialize'])
  .controller('SavedListsController', ["$scope", "$location", "SavedLists", "Recipes", function($scope, $location, SavedLists, Recipes) {

    $scope.getLists = function() {
      SavedLists.getLists()
        .then(function(lists) {
          $scope.lists = lists.data;

          for (var list in $scope.lists) {
            // Fetch the recipes associated with each list
            (function(list) {
              SavedLists.getRecipes(list)
                .then(function(recipes) {
                  $scope.lists[list].recipes = recipes.data;
                });
            })(list)

            // Add up the total price for each list
            var totalPrice = 0;
            for (var key in $scope.lists[list]) {
              // if we're examining an ingredient, the value of the key is a tuple, so we can check
              // for ingredients by looking for an array other than the recipes array. Then we add
              // to the total price the qty times the price
              if (Array.isArray($scope.lists[list][key]) && key !== 'recipes') {
                totalPrice += parseFloat($scope.lists[list][key][1])*parseFloat($scope.lists[list][key][0]);
              }
            }
            $scope.lists[list].totalPrice = totalPrice;

            // If list is unnamed, set it's list_name equal to its date
            if (!$scope.lists[list].list_name) {
              $scope.lists[list].list_name = $scope.lists[list].date;
            }
          }

          if (Object.keys($scope.lists).length === 0){
            $scope.show = true
          }

          $('.collapsible').collapsible();
        });
    };

    $scope.deleteListModal = function(list) {
      $scope.deleteList = list;
      $("#deleteCheck").openModal();
    }

    $scope.delete = function(list) {
      // Lookup list ID from $scope.lists
      for (var key in $scope.lists) {
        if($scope.lists[key] === list) {
          var listId = key;
        }
      }

      SavedLists.deleteList({id:listId}).then(function(){$scope.getLists()});
    };

    $scope.shop = function(list) {
      Recipes.selectedRecipes = [{ingredients:[], saved:true}];
      for (var key in list) {
        if (key === 'date' || key === 'list_name' || key === 'recipes' || key === 'totalPrice') continue;
        Recipes.selectedRecipes[0].ingredients.push([key,list[key][0]]);
      }
      $location.path('shopping-list');
    }

    $scope.getLists();

  }]);
