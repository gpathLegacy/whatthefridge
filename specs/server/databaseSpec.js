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

  var userObj = {
    'username': 'gigapath',
    'password': 'rarrrr'
  }
    
  var recipeObj = {
    'title': 'Pork Chop Sandwiches'
  }

  var ingredientObj = {
    'name': 'Pork Chops',
    'price': 13.99
  }

describe("Database unit tests", function(){

  describe("users model methods", function(){

    it("can create a new user", function(done){
      var addUser = dbUsers.signup(userObj).then(function(data){
        expect(data[0]).to.be.a('number');
        done();
      }) 
    });

    it("can find user by name", function(done){ //prevent empty object
      var getUser = dbUsers.getUserByName(userObj.username).then(function(data){
        userObj.id = data[0]['id'];
        expect(data[0]['id']).to.be.a('number');
        done();
      })
    });

    it("can find user by id", function(done){ //prevent empty object
      var getUser = dbUsers.getUserById(userObj.id).then(function(data){
        expect(data[0]['username']).to.equal(userObj.username);
        done();
      })
    });

  }),


  describe("recipes model methods", function(){
    
    it("can create a recipe", function(done){ 
      var newRecipe = dbRecipes.createRecipe(recipeObj.title, userObj.id).then(function(data){
        expect(data[0]).to.be.a('number');
        recipeObj.id = data[0];
        done();
      })
    });

    it("can get all recipes", function(done){ 
      var getRecipes = dbRecipes.getAllRecipes(userObj.id).then(function(data){
        expect(data[0]['title']).to.equal(recipeObj.title);
        done();
      })
    });

    it("can get a recipe by id", function(done){ 
      var getRecipe = dbRecipes.getRecipe(recipeObj.id).then(function(data){
        expect(data[0]['title']).to.equal(recipeObj.title);
        done();
      })
    });


    it("can edit a recipe", function(done){ 
      var editRecipe = dbRecipes.editRecipe(recipeObj.id, 'Pork Chop Friday').then(function(data){
        dbRecipes.getRecipe(recipeObj.id).then(function(data){
          expect(data[0]['title']).to.equal('Pork Chop Friday');
          done();
        })
      })
    });

  }),

  describe("ingredients model methods", function(){
    
    it("can add an ingredient", function(done){ 
      var addIngredient = dbIngredients.addIngredient(ingredientObj.name, ingredientObj.price).then(function(data){
        ingredientObj.id = data[0];
        expect(data[0]).to.be.a('number');
        done();
      })
    });

    it("can get an ingredient by ID", function(done){ 
      var getIngredientByID = dbIngredients.getIngredientById(ingredientObj.id).then(function(data){
        expect(data[0]['name']).to.equal(ingredientObj.name);
        done();
      })
    });

    it("can get an ingredient by name", function(done){ 
      var getIngredientByName = dbIngredients.getIngredientByName(ingredientObj.name).then(function(data){
        expect(data[0]['id']).to.equal(ingredientObj.id);
        done();
      })
    });

  })

  //delete test entries in database when functionality is added to models

}); 

