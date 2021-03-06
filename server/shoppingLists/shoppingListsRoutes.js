module.exports = function(app, ShoppingLists, Ingredients) {
  // shopping list routes go here
  var shoppingListsController = require('./shoppingListsController')(ShoppingLists, Ingredients);

  app.get('/getLists', shoppingListsController.getLists);
  app.post('/getRecipes', shoppingListsController.getRecipes);
  app.post('/saveList', shoppingListsController.saveList);
  app.post('/updateList', shoppingListsController.updateList);
  app.post('/deleteList', shoppingListsController.deleteList)
  app.post('/productLookup', shoppingListsController.productLookup);
}
