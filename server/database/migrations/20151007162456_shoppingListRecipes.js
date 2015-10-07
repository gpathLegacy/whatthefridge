
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('shopping_lists_recipes', function(table) {
      table.increments('id').primary();
      table.integer('list_id').references('id').inTable('shopping_lists');
      table.integer('recipe_id').references('id').inTable('recipes');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('shopping_lists_recipes');
};
