var express     = require('express'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan');

var app = express();
var PORT = 1337;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));
app.use('/bower_components', express.static(__dirname + '/../client/lib/bower_components'));
app.use(morgan('dev'));

// Passport requirements
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: 'choosymomschoosejeff',
  saveUninitialized: true,
  resave: true }));

// Define a middleware function to be used for every secured route
var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.send(401);
  else next();
};

// Below is some knex/database information, for testing passport. This should
// live somewhere else? And be required into this file.

var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    database : 'wtf'
  }
});

knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.string('username', 100);
      t.string('password', 100);
      t.string('fb_id', 100);
      t.string('fb_name', 100);
      t.string('fb_token', 255);
      t.string('twitter_id', 100);
      t.string('twitter_name', 100);
      t.string('twitter_token', 255);
      t.string('instagram_id', 100);
      t.string('instagram_name', 100);
      t.string('instagram_token', 255);
      t.string('google_id', 100);
      t.string('google_email', 100);
      t.string('google_token', 255);
    });
  }
});

knex.schema.hasTable('recipes').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('recipes', function(t) {
      t.increments('id');
      t.string('title');
    });
  }
});

knex.schema.hasTable('ingredients').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('ingredients', function(t) {
      t.increments('id');
      t.string('name').unique();
      t.decimal('price');
    });
  }
});

knex.schema.hasTable('recipes_ingredients').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('recipes_ingredients', function(t) {
      t.increments('id');
      t.integer('recipe_id');
      t.integer('ingredient_id');
    });
  }
});

// =========================================

// Pass database connection to each model

var Users = require('./users/usersModel')(knex);
var Recipes = require('./recipes/recipesModel')(knex);
var Ingredients = require('./ingredients/ingredientsModel')(knex);

// =========================================

require('./config/passport')(passport, knex, Users);
app.use(passport.initialize());
app.use(passport.session());

// =============== ROUTING =================

var usersRouter = express.Router();
var recipesRouter = express.Router();
var ingredientsRouter = express.Router();

app.use('/api/users', usersRouter); // use user router for all user request
app.use('/api/recipes', recipesRouter); //use recipe router
app.use('/api/ingredients', ingredientsRouter); // use ingredient router

// inject our routers into their respective route files
require('./users/usersRoutes.js')(usersRouter, passport);
require('./recipes/recipesRoutes.js')(recipesRouter, Recipes, Ingredients);
require('./ingredients/ingredientsRoutes.js')(ingredientsRouter, passport);

// =========================================

app.listen(PORT);
