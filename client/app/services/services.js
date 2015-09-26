angular.module('wtf.services', [])
  .factory('Recipes', function($http) {

    var createRecipe = function(recipe){
      return $http.post('/api/recipes/createRecipe', recipe);
    }
    //post request to save edited recipe
    var editRecipe = function(recipe){
      return $http.post('/api/recipes/editRecipe', recipe);
    }
    //function to get all recipes
    //http get request for dashboard 

    return {createRecipe:createRecipe};
  });
