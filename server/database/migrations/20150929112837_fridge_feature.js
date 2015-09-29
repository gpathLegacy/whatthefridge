
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('fridge', function(table) {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users');
      table.integer('ingredient_id').references('id').inTable('ingredients');
      table.decimal('qty');
      table.string('qty_unit');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('fridge');
};
