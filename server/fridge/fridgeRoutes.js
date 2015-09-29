module.exports = function (app, Fridge) {
  var fridgeController = require('./fridgeController.js')(Fridge);
  
  app.post('/getFridge', fridgeController.getFridge);
  
};