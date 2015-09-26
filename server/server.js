var express     = require('express'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan');

var app = express();
var port = Number(process.env.PORT || 1337);

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

var knex = require('knex')(require('./database/knexfile.js').development);

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

app.listen(port);
