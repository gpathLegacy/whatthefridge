angular.module('wtf.saved-lists', [])
  .controller('SavedListsController', function($scope, $location, SavedLists, Recipes) {

    $scope.getLists = function() {
      SavedLists.getLists().then(function(lists) {
        $scope.lists = lists.data;
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

      SavedLists.deleteList(listId).then(function(){$scope.getLists()});
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

  });