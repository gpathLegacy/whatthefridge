angular.module('wtf.services', [])
  .factory('Recipes', function($http) {

    var createRecipe = function(recipe){
      return $http.post('/api/recipes/createRecipe', recipe);
    }
    //post request to save edited recipe
    var editRecipe = function(recipe){
      return $http.post('/api/recipes/editRecipe', recipe);
    }
    var getRecipes = function() {
      return $http.post('/api/recipes/getRecipes');
    }
    var getIngredientPrice = function(ingredient) {
      return $http.post('/api/ingredients/getPrice', ingredient);
    }
    var setIngredientPrice = function(ingredient) {
      return $http.post('/api/ingredients/setPrice', ingredient);
    }
    
    var selectedRecipes = [];

    return {createRecipe:createRecipe, 
            editRecipe:editRecipe, 
            getRecipes:getRecipes,
            selectedRecipes:selectedRecipes,
            getIngredientPrice:getIngredientPrice,
            setIngredientPrice:setIngredientPrice};
  });
