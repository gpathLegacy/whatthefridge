/* database models
exports model methods along with the connection object
getIngredientById - find ingredient row by id
getIngredientByName - find ingredient row by name
setIngredientPrice - sets price for a user's ingredient
addIngredient - adds new ingredient
deleteIngredient - deletes new ingredient
*/
module.exports = function(knex) {
    return {
      getIngredientById: function(ingredientId) {
        return knex
          .select('*')
          .from('ingredients')
          .where({
            'id': ingredientId
          });
      },
      getIngredientByName: function(user_id, name) {
        return knex('ingredients').select()
                 .where({
                  'name': name,   
                  'user_id': user_id
                });
      },
      setIngredientPrice: function(user_id, name, price) {
        return knex('ingredients').update({'price':price})
                  .where({
                    'name':name,
                    'user_id':user_id
                  });
      },
      addIngredient: function(user_id, name, price) {
        var price = price || 0;
        return knex('ingredients')
          .returning('id')
          .insert({
            'name': name,
            'price': price,
            'user_id': user_id
          });
      },

      // Below method used for unit testing
      deleteIngredient: function(ingredientId) {
        return knex('ingredients')
          .where("id", ingredientId)
          .del();
      }
    }
}
