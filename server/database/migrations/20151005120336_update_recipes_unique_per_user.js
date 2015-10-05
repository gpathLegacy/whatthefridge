
exports.up = function(knex, Promise) {
  var recipes_update = knex.schema.table('recipes', function(table){
    table.dropUnique('title');
    table.unique(['title', 'user_id']);
  })

  return Promise.all([recipes_update])
};

exports.down = function(knex, Promise) {
  
};
