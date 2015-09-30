angular.module('wtf.edit-recipes', [])
  .controller('EditRecipesController', function($scope, $window, $location, currentRecipeService, Recipes){

    //local variable storing new and existing recipe values
    //prepopulate ingredients array with the existing values
    $scope.recipe = {ingredients: [], remove: []};
    $scope.currentRecipe = currentRecipeService.getRecipeToEdit();
    console.log($scope.currentRecipe, " am i in the right");
    //read the currentRecipe and push values into scope.recipe
    for(var i=0; i<$scope.currentRecipe.ingredients.length; i++) {
      $scope.recipe.ingredients.push($scope.currentRecipe.ingredients[i]);
    }
    //render the existing recipe title
    $scope.recipe.name = $scope.currentRecipe.title;
    $scope.recipe.id = $scope.currentRecipe.id;
    //if recipe title has changed //run update title anyway
    // if(!currentRecipe.title === $scope.recipe.name) {
    // }
          /* Format of currentRecipe
      id: 10
      ingredients: Array[2]
                    0: "tomatoes"
                    1: "bell peppers"length: 
      Objecttitle: "ratatouille"
      */
    
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

    // use diffing to remove ingredients from database
    // existing ingredients are in currentRecipe
    // find entries in currentRecipe NOT in ingredients
    // do this in saveRecipe

    //save recipe to database and redirect to dashboard
    $scope.saveRecipe = function() {
      for(var i=0; i<$scope.currentRecipe.ingredients.length; i++) {
        //if old ingredients not found in the array
        if( $scope.recipe.ingredients.indexOf($scope.currentRecipe.ingredients[i]) < 0 ) {
          $scope.recipe.remove.push($scope.currentRecipe.ingredients[i]);
        }
      }

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
