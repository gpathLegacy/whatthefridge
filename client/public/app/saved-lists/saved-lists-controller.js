angular.module('wtf.saved-lists', [])
  .controller('SavedListsController', function($scope, $location, SavedLists, Recipes) {

    $scope.getLists = function() {
      SavedLists.getLists().then(function(lists) {
        console.log(lists.data);
        $scope.lists = lists.data;
      });
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