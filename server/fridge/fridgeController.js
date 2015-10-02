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
          Ingredients.getIngredientByName(req.user.id, list[i].name).then(function(ingredient) {
            Fridge.checkForItem(req.user.id, ingredient[0].id).then(function(fridgeIngredient) {
              if (fridgeIngredient.length) {
                // if item is already in user's fridge, update quantity
                Fridge.updateItemQty(req.user.id, ingredient[0].id, list[index].qty).then(function(){});
              }
              else {
                // else add item to fridge
                Fridge.addNewItem(req.user.id, ingredient[0].id, list[index].qty).then(function(){});
              }
            })
          });
        })(i)
      }
      res.send(200);
    },

    addItem: function(req, res) {
      var item = req.body;

      console.log("Item to add: ", item);

      Ingredients.getIngredientByName(req.user.id, item.name).then(function(ingredient) {
        // if ingredient exists, add one to fridge (first see if it's already in fridge)
        if(ingredient.length) {
          Fridge.checkForItem(req.user.id, ingredient[0].id).then(function(fridgeIngredient) {
            if(fridgeIngredient.length) {
              Fridge.updateItemQty(req.user.id, ingredient[0].id, 1).then(function(){res.send(200);});
            }
            else {
              Fridge.addNewItem(req.user.id, ingredient[0].id, 1).then(function(){res.send(200);});
            }
          });
        }

        // if ingredient doesn't exist, add ingredient first, then add one to fridge
        else {
          Ingredients.addIngredient(req.user.id, item.name, 0).then(function(ingredient) {
            console.log("New ingredient?", ingredient);
            Fridge.addNewItem(req.user.id, ingredient[0], 1).then(function(){res.send(200);});
          });
        }   
      });
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
