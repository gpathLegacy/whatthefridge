angular.module('wtf.create-recipes', [])
  .controller('CreateRecipesController', ["$scope", "$window", "$location", "Recipes", function($scope, $window, $location, Recipes) {

    $scope.recipe = {ingredients: []};

    $scope.addIngredient = function() {
        $scope.recipe.ingredients.push($scope.newIngredient);
        $scope.newIngredient = "";
    };

    $scope.removeIngredient = function(ingredient) {
        $scope.recipe.ingredients.splice($scope.recipe.ingredients.indexOf(ingredient), 1);
    };

    $scope.saveRecipe = function() {
        Recipes.createRecipe($scope.recipe)
          .then(function(){
            $location.path("/recipes");
          });
    };
  }]);
