angular.module('wtf.create-recipes', [])
  .controller('CreateRecipesController', ["$scope", "$window", "$location", "Recipes", function($scope, $window, $location, Recipes) {

    $scope.recipe = {
                      ingredients: [],
                      instructions: ""
                    };
    $scope.recipeError = false;
    $scope.ingredientError = false;
    $scope.noIngredients = false;

    $scope.addIngredient = function() {
      if ($scope.newIngredient === undefined || $scope.newIngredient === "") {
        $scope.ingredientError = true;
      }
      else {
        $scope.recipe.ingredients.push($scope.newIngredient);
        $scope.newIngredient = "";
        $scope.ingredientError = false;
      }
    };

    $scope.removeIngredient = function(ingredient) {
        $scope.recipe.ingredients.splice($scope.recipe.ingredients.indexOf(ingredient), 1);
    };

    $scope.saveRecipe = function() {
      if ($scope.recipe.name === undefined || $scope.recipe.name === "") {
        $scope.recipeError = true;
      } else if (!$scope.recipe.ingredients.length) {
        $scope.noIngredients = true;
      }
      else {
        $scope.recipeError = false;
        Recipes.createRecipe($scope.recipe)
          .then(function(){
            $location.path("/recipes");
          });
      }
    };
  }]);
