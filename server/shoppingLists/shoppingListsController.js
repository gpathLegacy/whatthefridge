module.exports = function(ShoppingLists, Ingredients) {
  return {
    // shopping lists controls go here
    getLists: function(req, res) {
      ShoppingLists.getLists(req.user.id).then(function(ingredients) {

        // Each item in "ingredients" is an ingredient associated with a shopping list and a quantity
        // Iterate over each row, generate shopping list that contains ingredients
        var lists = {};
        for (var i = 0; i < ingredients.length; i++) {
          var listId = ingredients[i].shopping_list_id;
          var ingredientName = ingredients[i].name;
          var ingredientQty = ingredients[i].qty;
          var ingredientPrice = ingredients[i].price;

          // First time the list is encountered, it needs to be created in the output object
          // and initialized with the date
          if (lists[listId] === undefined) {
            lists[listId] = {date:ingredients[i].date.toDateString()};
          }
          // We need to send back the quantity and price, so let's make it a tuple
          lists[listId][ingredientName] = [ingredientQty, ingredientPrice];
        }
        res.send(lists);
      });
    },

    saveList: function(req, res) {
      var list = req.body;

      ShoppingLists.newList(req.user.id).then(function(id) {
        var listId = id[0];
        for (var i = 0; i < list.length; i++) {
          (function(index){
            Ingredients.getIngredientByName(req.user.id, list[i].name).then(function(ingredient) {
              ShoppingLists.newItem(listId, ingredient[0].id, list[index].qty).then(function(){});
            });
          })(i)
        }
      });

      res.send(200);
    },

    deleteList: function(req, res) {
      var listId = req.body.id;

      ShoppingLists.deleteListIngredients(listId).then(function() {
        ShoppingLists.deleteList(listId).then(function() {
          res.send(200);
        })
      })
    }
  }
};