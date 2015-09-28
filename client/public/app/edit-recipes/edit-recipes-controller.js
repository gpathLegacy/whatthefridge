angular.module('wtf.edit-recipes', [])
  .controller('EditRecipesController', function($scope, $window, $location, Recipes){

    //local variable storing new and existing recipe values
    //prepopulate ingredients array with the existing values
    $scope.recipe = {ingredients: []};

  
    //add a new ingredient. works the same as create recipe
    $scope.addIngredient = function() {
      $scope.recipe.ingredients.push($scope.newIngredient);
      $scope.newIngredient = "";
    };

    //remove an ingredient
    $scope.removeIngredient = function(ingredient) {
      $scope.recipe.ingredients.splice($scope.recipe.ingredients.indexOf(ingredient), 1);
    };

    //use diffing to remove ingredients from database 

    //save recipe to database
    $scope.saveRecipe = function() {
      Recipes.editRecipe($scope.recipe)
        .then(function(){
          $location.path("/dashboard");
        });
    };

  });

  /*
    get passed in a recipe
    generate a form with the existing values populated
    have a submit button for the form
  */
