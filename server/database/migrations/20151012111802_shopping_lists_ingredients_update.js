
exports.up = function(knex, Promise) {
   return knex.schema.dropTable('shopping_lists_ingredients')
    .createTable('shopping_lists_ingredients', function(table){
      table.increments('id').primary();
      table.integer('shopping_list_id').references('id').inTable('shopping_lists');
      table.integer('ingredient_id').references('id').inTable('ingredients');
      table.decimal('qty');
   })
};

exports.down = function(knex, Promise) {
  
};
