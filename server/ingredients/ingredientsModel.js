/* database models
exports model methods along with the connection object
addIngredients - add a new ingredient
getIngredientById - find ingredient row by id
getIngredientByName - find ingredient row by name
*/
module.exports = function(knex) {
    return {
      getIngredientById: function(ingredientId) {
        return knex
          .select('*')
          .from('ingredients')
          .where({
            'id': ingredientId
          })
      },
      getIngredientByName: function(name, userId) {
        return knex('ingredients').select()
                 .where({
                  'name': name, 
                  'user_id': userId
                });
      },
      addIngredient: function(name, userId, price) {
        var price = price || 0;
        return knex('ingredients')
          .returning('id')
          .insert({
            'name': name,
            'price': price,
            'user_id': userId
          });
      }
    }
}
