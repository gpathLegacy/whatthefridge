
exports.up = function(knex, Promise) {
  var recipes_update = knex.schema.table('recipes', function(table){
    table.unique('title');
  })
  var recipes_ings_mapping_update = knex.schema.table('recipes_ingredients', function(table){
    table.unique(['recipe_id','ingredient_id']);
  })

  return Promise.all([recipes_update, recipes_ings_mapping_update])
};

exports.down = function(knex, Promise) {
  
};
