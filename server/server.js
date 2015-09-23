var express     = require('express'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan');

var app = express();
var PORT = 1337;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));
app.use('/bower_components', express.static(__dirname + 'client/lib/bower_components'));
app.use(morgan('dev'));

var usersRouter = express.Router();
var recipesRouter = express.Router();
var ingredientsRouter = express.Router();

app.use('/api/users', usersRouter); // use user router for all user request
app.use('/api/recipes', recipesRouter); //use recipe router
app.use('/api/ingredients', ingredientsRouter); // use ingredient router

// inject our routers into their respective route files
require('./users/usersRoutes.js')(usersRouter);
require('./recipes/recipesRoutes.js')(recipesRouter);
require('./ingredients/ingredientsRoutes.js')(ingredientsRouter);

app.listen(PORT);
