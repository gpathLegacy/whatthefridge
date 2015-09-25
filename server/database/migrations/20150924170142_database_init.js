//migrations to handle initial schema setup and schema drop using knex up and down functions
// promise as an optional argument to the exports function?

//Questions: what to name the migrations file, create using knex?
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table){
      table.increments('id').primary(); //primary is optional when only one field is using increments
      table.string('username', 100);
      table.string('password', 100);
      table.string('fb_id', 100);
      table.string('fb_name', 100);
      table.string('fb_token', 255);
      table.string('twitter_id', 100);
      table.string('twitter_name', 100);
      table.string('twitter_token', 255);
      table.string('instagram_id', 100);
      table.string('instagram_name', 100);
      table.string('instagram_token', 255);
      table.string('google_id', 100);
      table.string('google_email', 100);
      table.string('google_token', 255);
      // table.timestamps(); //might be helpful later
    })
    .createTable('recipes', function(table){
      table.increments('id');
      table.string('title');
      table.integer('user_id').references('id').inTable('users');
      // table.timestamps();
    })
    .createTable('ingredients', function(table){
      table.increments('id');
      table.string('name').unique();
      table.decimal('price'); //for exact and accurate values
      // table.timestamps();
    }) 
    .createTable('recipes_ingredients', function(table){
      table.integer('recipe_id').references('id').inTable('recipes');
      table.integer('ingredient_id').references('id').inTable('ingredients');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('recipes_ingredients')
    .dropTable('ingredients')
    .dropTable('recipes')
    .dropTable('users')
};
