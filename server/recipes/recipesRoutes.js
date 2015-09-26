

// For recipes
module.exports = function (app, Recipes, Ingredients) {
  var recipesController = require('./recipesController.js')(Recipes, Ingredients);
  // app === usersRouter injected from middlware.js
  // app.post('/login', usersController.login);
  // app.post('/signup', usersController.signup);
  // app.get('/signedin', usersController.checkAuth)
  // app.get('/:id', usersController.serveData);

  app.post('/createRecipe', recipesController.createRecipe);
  
};
