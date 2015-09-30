angular.module('wtf.dashboard', ['checklist-model'])
  .controller('DashboardController', function($scope, $window, $location, Recipes) {

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
      $location.path('shopping-list');
    };

    $scope.deleteModal = function(recipe){
      $scope.deleteRecipe = recipe;
      $("#deleteCheck").openModal();
    };

    $scope.delete = function(recipe){
      Recipes.deleteRecipe(recipe)
      .success(function(data){
        $scope.getAllRecipes();
      })
    }

    $scope.getAllRecipes();
  });
