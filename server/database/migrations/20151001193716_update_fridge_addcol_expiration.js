
exports.up = function(knex, Promise) {
   var fridge_update = knex.schema.table('fridge', function(table){
    table.dateTime('expiration');
  })

  return Promise.all([fridge_update]);
};

exports.down = function(knex, Promise) {
  
};
