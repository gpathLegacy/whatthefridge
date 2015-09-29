
exports.up = function(knex, Promise) {
  return knex.schema
    .table('ingredients', function(table){
      .table.integer('user_id').references('id').inTable('users')   
      .table.unique(['user_id', 'name']) 
      })
    .table('users', function(table){
      .table.unique('username')
    })  
};

exports.down = function(knex, Promise) {
  
};
