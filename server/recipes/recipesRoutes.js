

// For recipes
module.exports = function (app, auth, Recipes, Ingredients) {
  var recipesController = require('./recipesController.js')(Recipes, Ingredients);

  app.post('/createRecipe', auth, recipesController.createRecipe);
  
};
