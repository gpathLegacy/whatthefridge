

// For recipes
module.exports = function (app, Recipes, Ingredients) {
  var recipesController = require('./recipesController.js')(Recipes, Ingredients);
  
  app.get('/getRecipes', recipesController.getRecipes);
  app.get('/suggestRecipe', recipesController.suggestRecipe);
  app.post('/createRecipe', recipesController.createRecipe);
  app.post('/editRecipe', recipesController.editRecipe);
  app.post('/deleteRecipe', recipesController.deleteRecipe);
  app.post('/addSuggestedRecipe', recipesController.addSuggestedRecipe);
};
