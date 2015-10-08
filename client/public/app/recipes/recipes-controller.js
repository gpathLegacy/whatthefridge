angular.module('wtf.recipes', ['checklist-model'])
  .controller('RecipesController', function($scope, $window, $location, currentRecipeService, Recipes) {


    $scope.getAllRecipes = function() {
      Recipes.getRecipes()
      .success(function(data){
        $scope.allRecipes = data;
      })
      .catch(function(err){
        console.log(err);
      })
    };

    //this is run from the dashboard html, on clicking a specific recipe
    $scope.getCurrentRecipe = function(currentRecipe) {
      $scope.currentRecipe = currentRecipe;
      //add to services variable to share with other ingredients
      currentRecipeService.addRecipeToEdit(currentRecipe);
      $location.path('/edit-recipes');
    };

    $scope.recipes  = {
      selected: Recipes.selectedRecipes
    };

    // $scope.$watch(Auth.isAuth, function(authed) {
    //   if (authed) {
    //     $location.path('/create-recipes');
    //   } else {
    //     $location.path('/');
    //   }
    // }, true);
    
    $scope.getShoppingList = function() {
      $("#shopCheck").closeModal();
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
    };

    $scope.suggestRecipe = function(){
      Recipes.suggestRecipes()
      .success(function(data){
        console.log("This is suggestRecipe data: ",data);
        $scope.suggestedRecipe = data;
      })
      .catch(function(err){
        console.log(err);
      })
    };

    $scope.addSuggestedRecipe = function(suggestedRecipe){
      Recipes.addSuggestedRecipe(suggestedRecipe)
      .success(function(data){
        console.log("What client controller recieves: ", data);
      })
      .catch(function(err){
        console.log(err, " error in client controller");
      })
    };

    $scope.getAllRecipes();
    $scope.suggestRecipe();
  });
