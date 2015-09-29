
// For individual ingredients
module.exports = function (app, Ingredients) {
  var ingredientsController = require('./ingredientsController.js')(Ingredients);

  app.post('/getPrice', ingredientsController.getPrice);
  app.post('/setPrice', ingredientsController.setPrice);
};
