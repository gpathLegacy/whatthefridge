module.exports = function(knex) {
  return {
    getFridgeByUser: function(user_id) {
      return knex('fridge')
        .select()
        .where('fridge.user_id', user_id)
        .innerJoin('ingredients', "fridge.ingredient_id", "ingredients.id");
    },
    addNewItem: function(user_id, ingredient_id, qty) {
      return knex('fridge')
        .insert({
          'user_id': user_id,
          'ingredient_id':ingredient_id, 
          'qty':qty
        });
    },
    checkForItem: function(user_id, ingredient_id) {
      return knex('fridge')
        .select()
        .where({
          'user_id':user_id, 
          'ingredient_id':ingredient_id
        });
    },
    updateItemQty: function(user_id, ingredient_id, qty) {
      return knex('fridge')
        .increment('qty', qty)
        .where({
          'user_id': user_id, 
          'ingredient_id':ingredient_id
        });
    },
    setItemQty: function(user_id, ingredient_id, qty) {
      return knex('fridge')
        .update('qty', qty)
        .where({
          'user_id':user_id, 
          'ingredient_id':ingredient_id
        });
    }
  }
}
