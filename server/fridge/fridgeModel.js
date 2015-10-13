module.exports = function(knex) {
  return {
    getFridgeByUser: function(user_id) {
      return knex('fridge')
        .select()
        .where('fridge.user_id', user_id)
        .innerJoin('ingredients', "fridge.ingredient_id", "ingredients.id");
    },
    getItemByExp: function(user_id, ingredient_id, expiration){
      return knex('fridge')
        .select('id')
        .where({
          'user_id': user_id,
          'ingredient_id': ingredient_id,
          'expiration': expiration
        });
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
    updateItemQty: function(id, user_id, ingredient_id, passed) {
      return knex('fridge')
        .where({
          'id': id,
          'user_id': user_id, 
          'ingredient_id':ingredient_id
        })
        .increment('qty', Number(passed));
    },

    updateItemExp: function(id, expiration) {
      return knex('fridge')
        .where({
          'id':id,
        })
        .update({
          'expiration':expiration
        });
    },
    setItemQty: function(id, qty) {
      return knex('fridge')
        .update('qty', qty)
        .where({
          'id':id
        })
        .then(function(){
          return knex('fridge')
          .where({
            'id':id,
            'qty': 0
          })
          .del();
        })
        .then(function(){
          // needed to pass the item ID back to the next function
          return knex('fridge')
          .where({
            'id':id
          });
        });
    },
    deleteItem: function(user_id, ingredient_id) {
      return knex('fridge')
        .where({
          'user_id':user_id,
          'ingredient_id':ingredient_id
        })
        .del();
    }
  }
}
