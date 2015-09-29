var express     = require('express'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan');

var app = express();
var PORT = 1337;
var path = require('path');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/public'));
app.use('/bower_components', express.static(__dirname + '/../client/public/lib/bower_components'));
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

var knex = require('knex')(require('./database/knexfile.js').development);

// =========================================

// Pass database connection to each model

var Users = require('./users/usersModel')(knex);
var Recipes = require('./recipes/recipesModel')(knex);
var Ingredients = require('./ingredients/ingredientsModel')(knex);
var Fridge = require('./fridge/fridgeModel')(knex);

// =========================================

require('./config/passport')(passport, knex, Users);
app.use(passport.initialize());
app.use(passport.session());

// =============== ROUTING =================

// Secured Routes --------------------------
var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.send(401);
  else next();
};

app.get('/app/about/about.html', auth, function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/app/about/about.html'));
});
app.get('/app/create-recipes/create-recipes.html', auth, function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/app/create-recipes/create-recipes.html'));
});
app.get('/app/dashboard/dashboard.html', auth, function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/app/dashboard/dashboard.html'));
});
app.get('/app/edit-recipes/edit-recipes.html', auth, function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/app/edit-recipes/edit-recipes.html'));
});
app.get('/app/shopping-list/shopping-list.html', auth, function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/app/shopping-list/shopping-list.html'));
});
app.get('/app/fridge/fridge.html', auth, function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/app/fridge/fridge.html'));
});
// -----------------------------------------

var usersRouter = express.Router();
var recipesRouter = express.Router();
var ingredientsRouter = express.Router();
var fridgeRouter = express.Router();

app.use('/api/users', usersRouter); // use user router for all user request
app.use('/api/recipes', recipesRouter); //use recipe router
app.use('/api/ingredients', ingredientsRouter); // use ingredient router
app.use('/api/fridge', fridgeRouter);

// inject our routers into their respective route files
require('./users/usersRoutes.js')(usersRouter, passport);
require('./recipes/recipesRoutes.js')(recipesRouter, Recipes, Ingredients);
require('./ingredients/ingredientsRoutes.js')(ingredientsRouter, Ingredients);
require('./fridge/fridgeRoutes.js')(fridgeRouter, Fridge)

// =========================================

app.listen(PORT);
