/* database models
exports model methods along with the connection object
getRecipes - to refresh the /recipes page and render all recipes for a particular user
createRecipe - to add a new recipe to the user's collection
editRecipe - to edit an existing recipe from the user's collection
addRecipeMapping - add to the mapping table, representing the many to many relationship b/w recipes and ingredients
*/
module.exports = function(knex) {
    return {
      //fetch all recipes for a specific user. call user model method.
      getAllRecipes: function(userId) { //can be user name, depends on auth. id can be stored on the client's side
        return knex
          .select(['recipes.id', 'recipes.title', 'ingredients.name'])
          .from('recipes')
          .leftJoin('recipes_ingredients', 'recipes.id', 'recipes_ingredients.recipe_id')
          .leftJoin('ingredients', 'recipes_ingredients.ingredient_id', 'ingredients.id')
          .where({
            'recipes.user_id': userId
          })
      },
      getRecipe: function(recipeId) {
        return knex
        .select('*')
        .from('recipes')
        .where({
          'id': recipeId
        })
      },
      //create a new recipe. insert corresponding recipe, ingredients and mapped entries. 
      //insert into recipes, get the ids returned by the insert
      //insert into ingredients, get the ids returned by the insert
      //create the mapping table entries
      createRecipe: function(title, userId) {
        //handle the mapping insert on the server side instead of using currval() or lastval()
        return knex('recipes')
          .returning('id')
          .insert({
            'title': title,
            'user_id': userId
          })
      },
      //edit existing recipes. fetch associated data. update query for the recipe, mapped table.
      editRecipe: function(recipeId, title) { //only the title and ingredients need to be changed. mapping remains the same
        return knex('recipes')
          .where('id', '=', recipeId)
          .update({
            'title': title
          })
      },
      addRecipeMapping: function(recipeId, ingredientId) { //adds foreign keys to the recipe-ingredient map table
        //version 1: method receives one ingredient id at a time
        return knex('recipes_ingredients')
          .insert({
            'recipe_id': recipeId,
            'ingredient_id': ingredientId
          })

        // //version 2: method recieves all ingredients for a recipe at once
        // //ingredientId is an array. Use a loop to insert each?
        // return knex('recipes_ingredients')
        //   .insert({
        //   })
      }
    }
}

