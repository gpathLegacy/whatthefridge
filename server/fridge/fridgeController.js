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
        if (list[i].expiration === undefined) {
          list[i].expiration = new Date();
        }

        (function(index){
          Ingredients.getIngredientByName(req.user.id, list[i].name).then(function(ingredient) {
            // if ingredient doesn't exist (added on shopping list page), create ingredient first
            if (!ingredient.length) {

              Ingredients.addIngredient(req.user.id, list[index].name, list[index].price).then(function(id) {
                Fridge.addNewItem(req.user.id, id[0], list[index].qty, list[index].expiration).then(function(){});
              });
            }
            else {
              Fridge.checkForItem(req.user.id, ingredient[0].id).then(function(fridgeIngredient) {
                if (fridgeIngredient.length) {

                // if user left expiration blank, the expiration defaults to a Date object and must be converted
                // to string
                if (typeof list[index].expiration === 'object') {
                  list[index].expiration = list[index].expiration.toJSON();
                }

                var entered = list[index].expiration.split('T')[0];

                var match = fridgeIngredient.filter(function(item){
                  return item.expiration === null && entered === undefined || item.expiration && item.expiration.toISOString().split('T')[0] === entered
                });

                  if(match.length > 0){
                    //if there is an element that has the same expiration, we can increment it
                    var id = match[0].id;
                    Fridge.updateItemQty(id, req.user.id, ingredient[0].id, list[index].qty).then(function(){});
                  }else{
                    //otherwise, if the expiration dates are different, we can just add the entry as usual 
                    Fridge.addNewItem(req.user.id, ingredient[0].id, list[index].qty, list[index].expiration).then(function(){});

                  }
                  // if item is already in user's fridge, update quantity
                  // Fridge.updateItemQty(req.user.id, ingredient[0].id, list[index].qty).then(function(){});
                }
                else {
                  // else add item to fridge
                  Fridge.addNewItem(req.user.id, ingredient[0].id, list[index].qty, list[index].expiration).then(function(){});
                }
              });
            }
          });
        })(i)
      }
      res.send(200);
    },

    addItem: function(req, res) {
      var item = req.body;

      Ingredients.getIngredientByName(req.user.id, item.name).then(function(ingredient) {
        // if ingredient exists, add one to fridge (first see if it's already in fridge)
        if(ingredient.length) {
          Fridge.checkForItem(req.user.id, ingredient[0].id).then(function(fridgeIngredient) {
            if(fridgeIngredient.length) {
              Fridge.updateItemQty(fridgeIngredient[0].id, req.user.id, ingredient[0].id, 1).then(function(){res.send(200);});
            }
            else {
              Fridge.addNewItem(req.user.id, ingredient[0].id, 1, new Date()).then(function(){res.send(200);});
            }
          });
        }

        // if ingredient doesn't exist, add ingredient first, then add one to fridge
        else {
          Ingredients.addIngredient(req.user.id, item.name, 0).then(function(ingredient) {
            Fridge.addNewItem(req.user.id, ingredient[0], 1, new Date()).then(function(){res.send(200);});
          });
        }   
      });
    },

    updateFridge: function(req, res) {
      var newFridge = req.body;

      for (var i = 0; i < newFridge.length; i++) {
        (function(index){
          Fridge.getItemByExp(req.user.id, newFridge[index].ingredient_id, newFridge[index].oldExpiration)
            .then(function(itemId) {
              return Fridge.setItemQty(itemId[0].id, newFridge[index].qty);
            })
            .then(function(itemId){
              return Fridge.updateItemExp(itemId[0].id, newFridge[index].expiration);
            })
        })(i);
      }
      res.send(200);
    }
  }
}
