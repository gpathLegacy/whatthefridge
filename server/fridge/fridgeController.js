module.exports = function(Fridge, Ingredients) {
  return {
    getFridge: function(req, res) {
      Fridge.getFridgeByUser(req.user.id).then(function(data) {
        res.send(data);
      });
    },

    addList: function(req, res) {
      var list = req.body;

      for (var i = 0; i < list.length; i++) {
        (function(index){
          Ingredients.getIngredientByName(list[i].name).then(function(ingredient) {
            Fridge.checkForItem(req.user.id, ingredient[0].id).then(function(fridgeIngredient) {
              console.log("Fridge ingredient returned: ", fridgeIngredient);
              if (fridgeIngredient.length) {
                // if item is already in user's fridge, update quantity
                Fridge.updateItemQty(req.user.id, ingredient[0].id, list[index].qty).then(function(){});
              }
              else {
                // else add item to fridge
                console.log("Adding new item!");
                Fridge.addNewItem(req.user.id, ingredient[0].id, list[index].qty).then(function(){});
              }
            })
          });
        })(i)
      }
      res.send(200);
    },

    updateFridge: function(req, res) {
      var newFridge = req.body;

      for (var i = 0; i < newFridge.length; i++) {
        Fridge.setItemQty(req.user.id, newFridge[i].ingredient_id, newFridge[i].qty).then(function(){});
      }
      res.send(200);
    }
  }
}