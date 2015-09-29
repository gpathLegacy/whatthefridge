
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
      var recipeId = req.body.id;
      var recipeName = req.body.name;
      var newIngredients = req.body.ingredients;
      var removeIngredients = req.body.remove;

      // Get ingredient IDs that already exist for the user, or add new Ingredients.
      // After ingredient is added, map it to the recipe.
      for (var i = 0; i < newIngredients.length; i++) {

        (function(i) {
          Ingredients.getIngredientByName(newIngredients[i], req.user.id).then(function(row){
            if (row.length) {
              Recipes.addRecipeMapping(recipeID, row[0].id).then(function(){});
            }
            else {
              Ingredients.addIngredient(newIngredients[i], req.user.id).then(function(id) {
                Recipes.addRecipeMapping(recipeID, id[0]).then(function(){});
              })
            }
          })
        })(i);

      }

      //Remove ingredients from recipe mapping table. Keep in ingredients table(?).
      for (var j = 0; j < newIngredients.length; j++) {
        (function(i) {
          Recipes.removeRecipeMapping(recipeId, removeIngredients[j]).then(function(){});
        })(i);

      //update recipe name //no downstream changes
      Recipe.editRecipe(recipeName).then(function(){});

      }
      res.sendStatus(200);
    }
  } 
}

