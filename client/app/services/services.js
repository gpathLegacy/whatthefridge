angular.module('wtf')
  .factory('Recipes', function($http) {
    var factory = {};

    factory.createRecipe = function(){
      return $http.post('/api/recipes/createRecipe', $scope.recipe);
    }

    return factory;
  });