//database unit tests

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
// var dbIngredients = require('../../server/ingredients/ingredientsModel.js')(knex);

describe("Database unit tests", function(){

  describe("users model methods", function(){

    var userObj = {
      'username': 'james bond 10',
      'password': '0070'
    }

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

    //need to delete user after tests
  }),


  describe("recipes model methods", function(){
    
    it("can create a recipe", function(done){ 
      var newRecipe = dbRecipes.createRecipe('Pork Chop Sandwiches').then(function(data){
        console.log(data);
      })
    });

    it("can get all recipes", function(done){ 

    });

    it("can get a recipe by id", function(done){ 

    });


    it("can edit a recipe", function(done){ 

    });

    //need to delete recipe after tests
  }),

  describe("ingredients model methods", function(){
    
    it("can get an ingredient by ID", function(done){ 

    });

    it("can add an ingredient", function(done){ 

    });

  })

}); 

