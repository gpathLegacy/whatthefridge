//database unit tests
  var knex = require('knex')({ //remember to pass in knex (connection) to methods
     client: 'pg',
     connection: {
       host     : '127.0.0.1',
       database : 'gigapath'
     }
  });

var dbUsers = require('../../server/users/usersModel.js')(knex);
// var dbRecipes = require('../../server/recipes/recipesModel.js')(knex);
// var dbIngredients = require('../../server/ingredients/ingredientsModel.js')(knex);
var expect = require('chai').expect;

describe("Database unit tests", function(){
  // afterEach(function() {
  //   //knex close connection?
  // });
  describe("tests users model methods", function(){

    var userObj = {
      'username': 'james bond 8',
      'password': '0070'
    }

    it("is able to create a new user", function(done){ 
    //username, password

    var addUser = dbUsers.signup(userObj).then(function(data){
      userObj.id = data[0];
      console.log(userObj, "user object after adding id");
      expect(data[0]).to.be.a('number');
    }) 
    done();
    });

    it("it is able to find user by name", function(done){ //prevent empty object
      var getUser = dbUsers.getUserByName(userObj.username).then(function(data){
        console.log(data);
        expect(data[0]['id']).to.equal();
      })
      done();
    });

    it("it is able to find user by id", function(done){ //prevent empty object
      var getUser = dbUsers.getUserById(userObj.id).then(function(data){
        console.log(data);
        expect(data[0]['username']).to.equal(userObj.username);
      })
      done();
    });

  }),


  describe("tests recipes model methods", function(){
    
    it("Signup returns a token and a userid", function(done){ 
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:1337/api/users/signup',
      'json': {
        'username': 'Svnh',
        'password': 'Svnh'
      }
    };

    request(options, function(error, res, body){
      expect(body).to.have.property("token")
      expect(body).to.have.property("userid")
      done()
    }) 
    });

  }),

  describe("tests ingredients model methods", function(){
    
    it("Signup returns a token and a userid", function(done){ 
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:1337/api/users/signup',
      'json': {
        'username': 'Svnh',
        'password': 'Svnh'
      }
    };

    request(options, function(error, res, body){
      expect(body).to.have.property("token")
      expect(body).to.have.property("userid")
      done()
    }) 
    });

  })


}); 

