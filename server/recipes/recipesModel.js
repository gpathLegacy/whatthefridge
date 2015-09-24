/* database models

returns model methods along with the connection object

getRecipes - to refresh the /recipes page and render all recipes for a particular user
createRecipe - to add a new recipe to the user's collection
editRecipe - to edit an existing recipe from the user's collection

*/


module.exports = function(knex) {
    return {
      //fetch all recipes for a specific user. call user model method.
      getRecipes: function(userId) { //can be user name, depends on auth. id can be stored on the client's side

      },
      //create a new recipe. insert corresponding recipe, ingredients and mapped entries. call ingredients method.
      createRecipe: function(title) { //take ingredients from the argument array.

      },
      //edit existing recipes. fetch associated data. update query for the recipe, mapped table.
      editRecipe: function(recipeId) { //id is stored on the client's side but is invisible.

      }
    }
}