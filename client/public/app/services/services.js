angular.module('wtf.services', [])
  .factory('Recipes', function($http) {
    var createRecipe = function(recipe){
      return $http.post('/api/recipes/createRecipe', recipe);
    };
    return {createRecipe:createRecipe};
  })
  
  .factory('Navbar', function($http) {
    var isLoggedIn = function() {
      return $http.get('/api/users/checklogin')
    };
    var logOut = function() {
      return $http.get('/api/users/logout')
      .success(function(data) {
        console.log(data);
      })
      .error(function(data) {
        console.log('error: ' + data);
      });
    }
    return {isLoggedIn: isLoggedIn,
            logOut: logOut};
  })
