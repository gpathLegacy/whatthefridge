module.exports = function(knex) {
  return {
    getFridgeByUser: function(user_id) {
      return knex('fridge').select().where({'user_id':user_id}).innerJoin('ingredients', "fridge.ingredient_id", "ingredients.id");
    }
  }
}