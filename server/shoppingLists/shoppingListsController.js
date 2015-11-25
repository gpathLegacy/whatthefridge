var upc_api = require('../config/upc-api-secret.js');
var api_key = upc_api.semantics3.APIKey;
var api_secret = upc_api.semantics3.Secret;
var sem3 = require('semantics3-node')(api_key,api_secret);

module.exports = function(ShoppingLists, Ingredients) {
  return {
    productLookup: function(req, res){
      var upc=  req.body.listId.toString();
        // Build the request to the api
        sem3.products.products_field( "upc", upc );

        // Run the request
        sem3.products.get_products(
          function(err, products) {
              if (err) {
                 console.log("Couldn't execute request: get_products");
                 return;
              }
              // View the results of the request 
              //refactor to use a loop and look for decimal
              var result = JSON.stringify(products);
              result = JSON.parse(result);
              var n = result.search('"price":');
              var resultPrice = "";
              resultPrice += parseInt(result[n+10]+ result[n+11]);
              resultPrice += result[n+12];
              resultPrice += (result[n+13] + result[n+14]);
              resultPrice = parseFloat(resultPrice);
              var toSend = resultPrice; 
              //send the price back to service factory
              res.json(toSend)
           }
        )
    },
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
          // and initialized with the date and name
          if (lists[listId] === undefined) {
            lists[listId] = {list_name:ingredients[i].list_name, date:ingredients[i].date.toDateString()};
          }
          // We need to send back the quantity and price, so let's make it a tuple
          lists[listId][ingredientName] = [ingredientQty, ingredientPrice];
        }
        res.send(lists);
      });
    },

    getRecipes: function(req, res) {
      ShoppingLists.getRecipes(req.body.list)
        .then(function(recipes) {
          res.send(recipes);
        });
    },

    saveList: function(req, res) {
      var list = req.body.list;
      var recipes = [];

      ShoppingLists.newList(req.user.id, req.body.list_name).then(function(id) {
        var listId = id[0];
        for (var i = 0; i < list.length; i++) {
          (function(index){
            Ingredients.getIngredientByName(req.user.id, list[index].name).then(function(ingredient) {
              // check if Ingredient exists! if not, it needs to be added to ingredients table and
              // then added to the shopping_lists_ingredients table
              if (!ingredient.length) {
                Ingredients.addIngredient(req.user.id, list[index].name, list[index].price)
                  .then(function(ingredientId) {
                    ShoppingLists.newItem(listId, ingredientId[0], list[index].qty).then(function(){});
                  })
              } else {
                ShoppingLists.newItem(listId, ingredient[0].id, list[index].qty).then(function(){});
              }
            });
          })(i);
          // First check to see if the ingredient has associated recipes
          // Then, if recipe ID hasn't been added to recipes array, push it
          if (list[i].recipes){
            for (var j=0; j<list[i].recipes.length; j++) {
              if(recipes.indexOf(list[i].recipes[j]) === -1) {
                recipes.push(list[i].recipes[j]);
              }
            }
          }
        }

        // Map the recipes associated with this shopping list
        for (var i=0; i < recipes.length; i++) {
          ShoppingLists.addListMapping(listId, recipes[i]).then(function(){});
        }
        
      });
      res.send(200);
    },

    updateList: function(req, res) {
      var list = req.body.list;
      var listId = req.body.listId;

      ShoppingLists.updateList(req.user.id, listId)
        .then(function() {
          // iterate through each item in the list
          for (var i=0; i<list.length; i++) {
            (function(index){
              Ingredients.getIngredientByName(req.user.id, list[index].name)
                .then(function(ingredient) {
                  // check if Ingredient exists! if not, it needs to be added to ingredients table and
                  // then added to the shopping_lists_ingredients table
                  if (!ingredient.length) {
                    Ingredients.addIngredient(req.user.id, list[index].name, list[index].price)
                      .then(function(ingredientId) {
                        ShoppingLists.newItem(listId, ingredientId[0], list[index].qty).then(function(){});
                      })
                  } else {
                    // ingredient exists, so check to see if it's already mapped to this
                    // shopping list. If not, add the mapping. Otherwise, update the mapping.
                    ShoppingLists.getListMapping(listId, ingredient[0].id)
                      .then(function(mapping) {
                        if(!mapping.length) {
                          ShoppingLists.newItem(listId, ingredient[0].id, list[index].qty).then(function(){});
                        } else {
                          ShoppingLists.updateItem(listId, ingredient[0].id, list[index].qty).then(function(){});
                        }
                      })
                  }
                });
            })(i);
          }
        })


      res.send(200);
    },

    deleteList: function(req, res) {
      var listId = req.body.id;

      ShoppingLists.deleteListMappings(listId)
        .then(function() {
          return ShoppingLists.deleteListIngredients(listId)
        })
        .then(function() {
          return ShoppingLists.deleteList(listId);
        });

      res.send(200);
      
    }
  }
};
