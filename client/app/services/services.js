angular.module('wtf.services', [])
  .factory('Recipes', function($http) {

    var createRecipe = function(recipe){
      return $http.post('/api/recipes/createRecipe', recipe);
    }

    var editRecipe = function(recipe){
      return $http.post('/api/recipes/editRecipe', recipe);
    }

    return {createRecipe:createRecipe};
  });
