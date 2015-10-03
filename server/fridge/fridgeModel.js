module.exports = function(knex) {
  return {
    getFridgeByUser: function(user_id) {
      return knex('fridge')
        .select()
        .where('fridge.user_id', user_id)
        .innerJoin('ingredients', "fridge.ingredient_id", "ingredients.id");
    },
    addNewItem: function(user_id, ingredient_id, qty, expiration) {
      return knex('fridge')
        .insert({
          'user_id': user_id,
          'ingredient_id':ingredient_id, 
          'qty':qty,
          'expiration': expiration
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
        })
        .then(function(){
          return knex('fridge')
          .where({
            'user_id':user_id,
            'ingredient_id':ingredient_id,
            'qty': 0
          })
          .del();
        });
    }
  }
}
