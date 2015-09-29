
exports.up = function(knex, Promise) {
  var users_update = knex.schema.table('users', function(table){
    table.unique('username');
    })

  var ingredients_update = knex.schema.table('ingredients', function(table){
    table.integer('user_id').references('id').inTable('users');   
    table.dropUnique('name');
    table.unique(['user_id', 'name']); 
      })

  return Promise.all([ingredients_update, users_update]);
};

exports.down = function(knex, Promise) {
  
};
