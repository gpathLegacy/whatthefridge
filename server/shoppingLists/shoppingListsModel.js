// RAW QUERY FOR GETTING SHOPPING LIST INGREDIENTS SORTED BY RECIPE
//select * from shopping_lists
// inner join shopping_lists_recipes on shopping_lists.id=shopping_lists_recipes.list_id
// inner join recipes on shopping_lists_recipes.recipe_id=recipes.id 
// inner join recipes_ingredients on recipes.id=recipes_ingredients.recipe_id 
// inner join ingredients on recipes_ingredients.ingredient_id=ingredients.id
// where shoppings_lists.id = $1;


module.exports = function(knex) {
  return {
    // shopping list methods here
    getLists: function(user_id) {
      return knex('shopping_lists')
        .select('date', 'list_name', 'shopping_list_id', 'ingredient_id', 'ingredients.name', 'price', 'qty')
        .where('shopping_lists.user_id', user_id)
        .innerJoin('shopping_lists_ingredients', 'shopping_lists.id', 'shopping_lists_ingredients.shopping_list_id')
        .innerJoin('ingredients', 'shopping_lists_ingredients.ingredient_id', 'ingredients.id');
    },

    newList: function(user_id, list_name) {
      return knex('shopping_lists')
        .returning('id')
        .insert({
          'user_id':user_id,
          'list_name':list_name,
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

    addListMapping: function(shopping_list_id, recipe_id) {
      return knex('shopping_lists_recipes')
        .insert({
          'list_id':shopping_list_id,
          'recipe_id':recipe_id
        });
    },

    deleteListMappings: function(shopping_list_id) {
      return knex('shopping_lists_recipes')
        .where('list_id', shopping_list_id)
        .del();
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