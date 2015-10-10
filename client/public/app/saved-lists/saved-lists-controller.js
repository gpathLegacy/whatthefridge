angular.module('wtf.saved-lists', ['ui.materialize'])
  .controller('SavedListsController', ["$scope", "$location", "SavedLists", "Recipes", function($scope, $location, SavedLists, Recipes) {

    $scope.getLists = function() {
      SavedLists.getLists()
        .then(function(lists) {
          $scope.lists = lists.data;

          // Add up total price for each list
          for (var list in $scope.lists) {
            var totalPrice = 0;
            for (var key in $scope.lists[list]) {
              // if we're examining an ingredient, the value of the key is a tuple, so we can check
              // for ingredients by looking for an array. Then we add to the total price the qty times the price
              if (Array.isArray($scope.lists[list][key])) {
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
      Recipes.selectedRecipes = [{ingredients:[]}];
      for (var key in list) {
        if (key === 'date') continue;
        // push the ingredient once for every quantity
        for (var i = 0; i < list[key][0]; i++) {
          Recipes.selectedRecipes[0].ingredients.push(key)
        }
      }
      $location.path('shopping-list');
    }

    $scope.getLists();

  }]);
