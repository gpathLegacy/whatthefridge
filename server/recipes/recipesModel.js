/* database models
exports model methods along with the connection object
getRecipes - to refresh the /recipes page and render all recipes for a particular user
createRecipe - to add a new recipe to the user's collection
editRecipe - to edit an existing recipe from the user's collection
*/


module.exports = function(knex) {
    return {
      //fetch all recipes for a specific user. call user model method.
      getRecipes: function(userId) { //can be user name, depends on auth. id can be stored on the client's side
        return knex
          .select(['recipes.title', 'ingredients.name'])
          .from('recipes')
          .leftJoin('recipes_ingredients', 'recipes.id', 'recipes_ingredients.recipe_id')
          .leftJoin('ingredients', 'recipes_ingredients.ingredient_id', 'ingredients.id')
          .where({
            'user_id': userId
          })
      },

      //create a new recipe. insert corresponding recipe, ingredients and mapped entries. 
      //insert into recipes, get the id returned by the insert
      //insert into ingredients, get the ids returned by the insert
      //create the mapping table entries
      createRecipe: function(title) { //take ingredients from the argument array.
        return knex('recipes')
          .insert({
            'title': title,
          });

      },
      
      //edit existing recipes. fetch associated data. update query for the recipe, mapped table.
      editRecipe: function(recipeId) { //id is stored on the client's side but is invisible.
        return knex('recipes')


      }
    }
}