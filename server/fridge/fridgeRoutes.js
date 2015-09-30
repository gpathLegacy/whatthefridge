module.exports = function (app, Fridge, Ingredients) {
  var fridgeController = require('./fridgeController.js')(Fridge, Ingredients);
  
  app.post('/getFridge', fridgeController.getFridge);
  app.post('/addList', fridgeController.addList);
  app.post('/updateFridge', fridgeController.updateFridge);
  
};