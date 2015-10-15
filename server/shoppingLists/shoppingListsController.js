// var upc_api = require('/server/config/upc-api-secret.js');
var api_key = 'SEM36B982D5FD25FB00E55C7190B06D41A89';
var api_secret = 'YjIyMTY2NGJlN2I5NjNiNzgyZTMyMzlhNzNlMDhkZmQ';
var sem3 = require('semantics3-node')(api_key,api_secret);

module.exports = function(ShoppingLists, Ingredients) {
  return {
    // shopping lists controls go here
    productLookup: function(req, res){
      var upc=  req.body.listId.toString();
      console.log('server side upc is: ', upc)
                // Build the request
        sem3.products.products_field( "upc", upc );
        // sem3.products.products_field( "field", ["name","price",'price_currency'] );
        // sem3.products.products_field( "offset", 1 );

        // // Let's make a modification - say we no longer want the offset attribute
        // sem3.products.remove( "products", "offset" );

        // Run the request

        sem3.products.get_products(
          function(err, products) {
              if (err) {
                 console.log("Couldn't execute request: get_products");
                 return;
              }
              // View the results of the request
              var result = JSON.stringify(products);
              result = JSON.parse(result);
              var n = result.search('"price":');
              var resultPrice = "";
              resultPrice += parseInt(result[n+10]+ result[n+11]);
              resultPrice += result[n+12];
              resultPrice += (result[n+13] + result[n+14]);
              resultPrice = parseFloat(resultPrice);
              console.log(resultPrice, typeof(resultPrice)); //correct
                // console.log( "Results of request:\n"+ typeof(resultPrice) + resultPrice);
              var toSend = resultPrice; 
              console.log("the item to send back is: ", toSend)
              res.json(toSend)
           }
        )


        
        



        // console.log(resultSend, " result in server controller");
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
