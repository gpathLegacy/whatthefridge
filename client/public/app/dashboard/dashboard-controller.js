angular.module('wtf.dashboard', ['checklist-model'])
  .controller('DashboardController', function($scope, $window, Recipes) {

    $scope.getAllRecipes = function() {
      Recipes.getRecipes()
      .success(function(data){
        $scope.allRecipes = data;
      })
      .catch(function(err){
        console.log(err);
      })
    };

    $scope.recipes = {
      selected:Recipes.selectedRecipes
    };
    
    $scope.getShoppingList = function() {
      $location.path('/shopping-list');
    };

    $scope.getAllRecipes();
  });
