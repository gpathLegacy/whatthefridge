angular.module('wtf.edit-recipes', [])
  .controller('EditRecipesController', function($scope, $window, $location, Recipes){

    //local variable storing new and existing recipe values
    //prepopulate ingredients array with the existing values
    // $scope.recipe = {ingredients: []};

    /*
    //recipe.name and newIngredient are defined as ng-model
    prepopulate recipe.ingredients
    invisible data: recipe id, user id
    keep track of ingredients in 3 data structures:
    1: existing ingredients being removed
    2: existing ingredients being kept
    3: new ingredients being removed
    4: new ingredients being kept

    schema doesn't allow user-ingredient duplicates
    make a copy of existing ingredients 
    edit recipe using existing logic
    do a diff and send delete row request for recipe table and mapping table (auto)
    send insert request for recipe, ingredients and mapping tables
    */
    
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
