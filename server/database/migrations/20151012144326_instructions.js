
exports.up = function(knex, Promise) {
  return knex.schema.table('recipes', function(table){
    table.text('instructions');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('recipes', function(table){
    table.dropColumn('instructions');
  })
};
