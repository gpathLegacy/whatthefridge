angular.module('wtf.services', [])
  .factory('Recipes', function($http) {
    var deleteRecipe = function(recipe){
      return $http.post('/api/recipes/deleteRecipe', recipe)
    };

    var createRecipe = function(recipe){
      return $http.post('/api/recipes/createRecipe', recipe);
    };
    
    var editRecipe = function(recipe){
      return $http.post('/api/recipes/editRecipe', recipe);
    };
    
    var getRecipes = function() {
      return $http.post('/api/recipes/getRecipes');
    };

    var selectedRecipes = [];
    
    var getIngredientPrice = function(ingredient) {
      return $http.post('/api/ingredients/getPrice', ingredient);
    };
    
    var setIngredientPrice = function(ingredient) {
      return $http.post('/api/ingredients/setPrice', ingredient);
    };

    return {createRecipe:createRecipe, 
            editRecipe:editRecipe, 
            getRecipes:getRecipes,
            selectedRecipes:selectedRecipes,
            getIngredientPrice:getIngredientPrice,
            setIngredientPrice:setIngredientPrice,
            deleteRecipe: deleteRecipe
          };
  })
  
  .factory('Fridge', function($http) {
    var getFridge = function(){
      return $http.post('/api/fridge/getFridge');
    }

    var addList = function(list) {
      return $http.post('/api/fridge/addList', list);
    }

    var updateFridge = function(data) {
      return $http.post('/api/fridge/updateFridge', data);
    }

    return { getFridge:getFridge,
             addList:addList,
             updateFridge:updateFridge };
  })

  .factory('SavedLists', function($http) {
    var getLists = function() {
      return $http.get('/api/shoppingLists/getLists');
    }
    var saveList = function(list) {
      return $http.post('/api/shoppingLists/saveList', list);
    }

    return { getLists:getLists,
             saveList:saveList };
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

  .service('currentRecipeService', function() {
    var currentRecipeToEdit;

    var addRecipeToEdit = function(newObj) {
        currentRecipeToEdit = newObj;
    };

    var getRecipeToEdit = function(){
        return currentRecipeToEdit;
    };

    return {
      addRecipeToEdit: addRecipeToEdit,
      getRecipeToEdit: getRecipeToEdit
    };

});
