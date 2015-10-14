angular.module('wtf.services', [])
  .factory('Recipes', ["$http", function($http) {
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
      return $http.get('/api/recipes/getRecipes');
    };

    var getInstructions = function(recipe){
      return $http.post('api/recipes/getInstructions', recipe);
    }

    var suggestRecipes = function(allRecipes) {
      return $http.post('/api/recipes/suggestRecipe', allRecipes);
    };

    var addSuggestedRecipe = function(suggestRecipe){
      return $http.post('/api/recipes/addSuggestedRecipe', suggestRecipe);
    };

    var selectedRecipes = [];
    var idForInstructions;
    
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
            deleteRecipe:deleteRecipe,
            suggestRecipes:suggestRecipes,
            addSuggestedRecipe:addSuggestedRecipe,
            idForInstructions:idForInstructions,
            getInstructions:getInstructions
          };
  }])
  
  .factory('Fridge', ["$http", function($http) {
    var getFridge = function(){
      return $http.post('/api/fridge/getFridge');
    }

    var addList = function(list) {
      return $http.post('/api/fridge/addList', list);
    }

    var addItem = function(item) {
      return $http.post('/api/fridge/addItem', item);
    }

    var updateFridge = function(data) {
      return $http.post('/api/fridge/updateFridge', data);
    }

    return { getFridge:getFridge,
             addList:addList,
             addItem:addItem,
             updateFridge:updateFridge };
  }])

  .factory('SavedLists', ["$http", function($http) {
    var getLists = function() {
      return $http.get('/api/shoppingLists/getLists');
    }
    var getRecipes = function(list) {
      return $http.post('/api/shoppingLists/getRecipes', {'list':list});
    }
    var saveList = function(list, name) {
      return $http.post('/api/shoppingLists/saveList', {'list':list, 'list_name':name});
    }
    var deleteList = function(listId) {
      return $http.post('/api/shoppingLists/deleteList', listId);
    }

    return { getLists:getLists,
             getRecipes:getRecipes,
             saveList:saveList,
             deleteList:deleteList };
  }])

  .factory('Navbar', ["$http", function($http) {
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
  }])
  .factory('UpcLookup', ["$http", function($http){
    var productLookup = function(productUpc) {
      //api call to the third party database semantics3
    // GET https://api.semantics3.com/v1/products?q={
    // “upc”:”QUERY_VALUE1”,   
    // "fields": [
    //     "name",
    //     "price",
    //     "price_currency"
    //   ]}

    //method is http but url https, lookout for connection refusal errors
    //hardcoded product value for api testing
    var productUpc = '611269991000';
    var apiUrl = 'https://api.semantics3.com/v1/products?';
    $http({
       url: apiUrl, 
       method: "GET",
       params: {"upc": productUpc, 
          "fields": [
          "name",
          "price",
          "price_currency"
        ]}
    })
    .success(function(data){
      console.log("data as fetched from api in services: ", data);
      // return res.send(data);
    })
    }
    // return res.send(productDetails);
  }])
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
