
exports.up = function(knex, Promise) {
  return knex.schema.table('shopping_lists', function(table) {
    table.string('list_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('shopping_lists', function(table) {
    table.dropColumn('list_name');
  });
};
