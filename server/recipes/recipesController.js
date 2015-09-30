
module.exports = function(Recipes, Ingredients) {
  return {
    createRecipe: function(req, res) {
      var recipeName = req.body.name;
      var ingredients = req.body.ingredients;
      // Create the recipe in the recipes table
      Recipes.createRecipe(recipeName, req.user.id).then(function(id) {

        var recipeID = id[0];

        // Get ingredient IDs that already exist, or add new Ingredients.
        // After ingredient is added, map it to the recipe.
        for (var i = 0; i < ingredients.length; i++) {

          // Tricky way to pass i into promise scope
          (function(i) {
            Ingredients.getIngredientByName(ingredients[i]).then(function(row){
              if (row.length) {
                Recipes.addRecipeMapping(recipeID, row[0].id).then(function(){});
              }
              else {
                Ingredients.addIngredient(ingredients[i]).then(function(id) {
                  Recipes.addRecipeMapping(recipeID, id[0]).then(function(){});
                })
              }
            })
          })(i);

        }
      });

      res.sendStatus(200);
    },
    getRecipes: function(req, res) {
       Recipes.getAllRecipes(req.user.id)
        .then(function(data){
          var recipeResult = [];
          var currentRecipe = 10;
          var recipeObjCount = -1;
          for(var i=0; i<data.length; i++) {
            //if the data being read is for the same recipe, push to the ingredient 
            if (currentRecipe === data[i].id) {
              recipeResult[recipeObjCount]["ingredients"].push(data[i].name); 
            } else { //if the data is for a new recipe, create object and push the ingredient
              recipeObjCount++;
              recipeResult.push({id: data[i].id, title: data[i].title, ingredients: []});
              recipeResult[recipeObjCount]["ingredients"].push(data[i].name);
              currentRecipe = data[i].id;
            }             
          }
          res.send(recipeResult);
        })
        // res.sendStatus(200);
    },
    editRecipe: function(req, res) {
      var recipeID = req.body.id;
      var recipeName = req.body.name;
      var ingredients = req.body.ingredients;
      var removeIngredients = req.body.remove;

      // console.log(req.body, " request body in the server side controller");

      // Get ingredient IDs that already exist for the user, or add new Ingredients.
      // After ingredient is added, map it to the recipe.
      for (var i = 0; i < ingredients.length; i++) {

        (function(i) {
          console.log(req.user.id, " user id in server");
          Ingredients.getIngredientByName(ingredients[i], req.user.id).then(function(row){
            if (row.length) {
              console.log(recipeID, " recipe id in server add mapping", row[0].id, " second parameter in server add mapping");
              Recipes.addRecipeMapping(recipeID, row[0].id).then(function(){});
            }
            else {
              Ingredients.addIngredient(ingredients[i], req.user.id).then(function(id) {
              console.log(recipeID, " recipe id in server add mapping", id[0], " second parameter in server add mapping");
                Recipes.addRecipeMapping(recipeID, id[0]).then(function(){});
              })
            }
          })
        })(i);

      }

      //Remove ingredients from recipe mapping table. Keep in ingredients table(?).
      for (var j = 0; j < removeIngredients.length; j++) {
        (function(i) {
          console.log(recipeID, " recipe id in server remove mapping", removeIngredients[j], " second parameter in server  mapping");

          Recipes.removeRecipeMapping(recipeID, removeIngredients[j]).then(function(){});
        })(i);

      //update recipe name //no downstream changes
      Recipe.editRecipe(recipeName).then(function(){});

      }
      // res.sendStatus(200);
    }
  } 
}

