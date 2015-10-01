module.exports = function(knex) {
  return {
    // shopping list methods here
    getLists: function(user_id) {
      return knex('shopping_lists')
        .select('date', 'shopping_list_id', 'ingredient_id', 'ingredients.name', 'price', 'qty')
        .where('shopping_lists.user_id', user_id)
        .innerJoin('shopping_lists_ingredients', 'shopping_lists.id', 'shopping_lists_ingredients.shopping_list_id')
        .innerJoin('ingredients', 'shopping_lists_ingredients.ingredient_id', 'ingredients.id');
    },

    newList: function(user_id) {
      return knex('shopping_lists')
        .returning('id')
        .insert({
          'user_id':user_id,
          'date':'now'
        });
    },

    newItem: function(shopping_list_id, ingredient_id, qty) {
      return knex('shopping_lists_ingredients')
        .insert({
          'shopping_list_id':shopping_list_id,
          'ingredient_id':ingredient_id,
          'qty':qty
        })
    },

    deleteListIngredients: function(list_id) {
      return knex('shopping_lists_ingredients')
        .where('shopping_list_id', list_id)
        .del();
    },

    deleteList: function(list_id) {
      return knex('shopping_lists')
        .where('id', list_id)
        .del();
    }
  }
};