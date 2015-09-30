
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('shopping_lists', function(table) {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users');
      table.date('date');
    })
    .createTable('shopping_lists_ingredients', function(table) {
      table.increments('id').primary();
      table.integer('shopping_list_id').references('id').inTable('shopping_lists');
      table.integer('ingredient_id').references('id').inTable('ingredients');
      table.integer('qty');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('shopping_lists_ingredients')
    .dropTable('shopping_lists');
};
