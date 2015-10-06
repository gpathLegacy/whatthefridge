var expect = require('chai').expect;

var knex = require('knex')({ 
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    database : 'gigapath'
  }
});

var dbUsers = require('../../server/users/usersModel.js')(knex);
var dbRecipes = require('../../server/recipes/recipesModel.js')(knex);
var dbIngredients = require('../../server/ingredients/ingredientsModel.js')(knex);
var dbFridge = require('../../server/fridge/fridgeModel.js')(knex);
var dbShoppingLists = require('../../server/shoppingLists/shoppingListsModel.js')(knex);

  var userObj = {
    'username': 'gigapath',
    'password': 'rarrrr'
  };
    
  var recipeObj = {
    'title': 'Pork Chop Sandwiches'
  };

  var ingredientObj = {
    'name': 'Pork Chops',
    'price': 13.99
  };

  var shoppingListId;

describe("Database unit tests", function(){

  after(function(done) {
    dbShoppingLists.deleteListIngredients(shoppingListId)
    .then(function() {
      return dbShoppingLists.deleteList(shoppingListId);
    })
    .then(function(){
      return dbFridge.deleteItem(userObj.id, ingredientObj.id);
    })
    .then(function(){
      return dbRecipes.removeRecipeMapping(recipeObj.id, ingredientObj.id);
    })
    .then(function(){
      return dbRecipes.deleteRecipe(recipeObj.id);
    })
    .then(function() {
      return dbIngredients.deleteIngredient(ingredientObj.id);
    })
    .then(function() {
      return dbUsers.deleteUser(userObj.id);
    })
    .then(function() {
      done();
    });
  });

  describe("users model methods", function(){


    it("can create a new user", function(done){
      dbUsers.signup(userObj)
        .then(function(data){
          userObj.id = data[0];
          expect(userObj.id).to.be.a('number');
          done();
        });
    });

    it("can find user by name", function(done){ //prevent empty object
      dbUsers.getUserByName(userObj.username)
        .then(function(data){
          expect(data[0]['id']).to.be.a('number');
          done();
        });
    });

    it("can find user by id", function(done){ //prevent empty object
      dbUsers.getUserById(userObj.id)
        .then(function(data){
          expect(data[0]['username']).to.equal(userObj.username);
          done();
        });
    });

  }),


  describe("recipes model methods", function(){
    
    it("can create a recipe", function(done){ 
      dbRecipes.createRecipe(recipeObj.title, userObj.id)
        .then(function(data){
          expect(data[0]).to.be.a('number');
          recipeObj.id = data[0];
          done();
        });
    });

    it("can get all recipes", function(done){ 
      dbRecipes.getAllRecipes(userObj.id)
        .then(function(data){
          expect(data[0]['title']).to.equal(recipeObj.title);
          done();
        });
    });

    it("can get a recipe by id", function(done){ 
      dbRecipes.getRecipe(recipeObj.id)
        .then(function(data){
          expect(data[0]['title']).to.equal(recipeObj.title);
          done();
        });
    });


    it("can edit a recipe", function(done){ 
      dbRecipes.editRecipe(recipeObj.id, 'Pork Chop Friday')
        .then(function(){
          return dbRecipes.getRecipe(recipeObj.id);
        })
        .then(function(data){
          expect(data[0]['title']).to.equal('Pork Chop Friday');
          done();
        });
    });

    it("can get all other users' recipes", function(done){ 
      dbRecipes.getAllOtherUserRecipes(userObj.id)
        .then(function(data){
          //requires there to be existing user recipe data or will throw error
          expect(data.length).to.be.above(0);
          done();
        });
    });

    it("can get a recipe by title", function(done){ 
      dbRecipes.getRecipeByTitle(userObj.id, 'Pork Chop Friday')
        .then(function(){
          return dbRecipes.getRecipe(recipeObj.id);
        })
        .then(function(data){
          expect(data[0]['title']).to.equal('Pork Chop Friday');
          done();
        });
    });

  }),

  describe("ingredients model methods", function(){
    
    it("can add an ingredient", function(done){ 
      dbIngredients.addIngredient(userObj.id, ingredientObj.name, ingredientObj.price)
        .then(function(data){
          ingredientObj.id = data[0];
          expect(data[0]).to.be.a('number');
          done();
        });
    });

    it("can get an ingredient by ID", function(done){ 
      dbIngredients.getIngredientById(ingredientObj.id)
        .then(function(data){
          expect(data[0]['name']).to.equal(ingredientObj.name);
          done();
        });
    });

    it("can get an ingredient by name and userID", function(done){ 
      dbIngredients.getIngredientByName(userObj.id, ingredientObj.name)
        .then(function(data){
          expect(data[0]['id']).to.equal(ingredientObj.id);
          done();
        });
    });

    it("can change a recipe price", function(done) {
      dbIngredients.setIngredientPrice(userObj.id, ingredientObj.name, 2.00)
        .then(function(){
          return dbIngredients.getIngredientByName(userObj.id, ingredientObj.name);
        })
        .then(function(data) {
          expect(data[0]['price']).to.equal('2.00');
          done();
        });
    });

    it("can associate a recipe with an ingredient", function(done) {
      dbRecipes.addRecipeMapping(recipeObj.id, ingredientObj.id)
        .then(function() {
          return dbRecipes.getAllRecipes(userObj.id);
        })
        .then(function(data) {
          expect(data[0]['title']).to.equal('Pork Chop Friday');
          expect(data[0]['name']).to.equal('Pork Chops');
          done();
        });
    });

  });


  describe("fridge model methods", function(){

    it("can add an item to the fridge", function(done) {
      dbFridge.addNewItem(userObj.id, ingredientObj.id, 5.00)
        .then(function() {
          return dbFridge.checkForItem(userObj.id, ingredientObj.id);
        })
        .then(function(data) {
          expect(data[0]['qty']).to.equal('5.00');
          done();
        });
    });

    it("can get fridge by userID", function(done) {
      dbFridge.getFridgeByUser(userObj.id)
        .then(function(data) {
          expect(data[0]['ingredient_id']).to.equal(ingredientObj.id);
          done();
        });
    });

    it("can update item quantity in fridge", function(done) {
      dbFridge.updateItemQty(userObj.id, ingredientObj.id, 1.00)
        .then(function() {
          return dbFridge.checkForItem(userObj.id, ingredientObj.id);
        })
        .then(function(data) {
          expect(data[0]['qty']).to.equal('6.00');
          done();
        });
    });

    it("deletes items when quantity is set to zero", function(done) {
      dbFridge.setItemQty(userObj.id, ingredientObj.id, 0)
        .then(function(){
          return dbFridge.checkForItem(userObj.id, ingredientObj.id);
        })
        .then(function(data) {
          expect(data[0]).to.equal(undefined);
          done();
        });
    });

  });

  describe("shoppingList model methods", function() {
    
    it("can add a new list for a user", function(done) {
      dbShoppingLists.newList(userObj.id)
        .then(function(id){
          shoppingListId = id[0];
          return dbShoppingLists.newItem(id[0], ingredientObj.id, 1)
        })
        .then(function(){
          return dbShoppingLists.getLists(userObj.id);
        })
        .then(function(data){
            expect(data[0]['id']).to.be.a('number');
            done();
        });
    });

  });

}); 

