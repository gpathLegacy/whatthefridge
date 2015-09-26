angular.module('wtf.services', [])
  .factory('Recipes', function($http) {

    var createRecipe = function(recipe){
      return $http.post('/api/recipes/createRecipe', recipe);
    }

    return {createRecipe:createRecipe};
  });