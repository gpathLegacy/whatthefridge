var usersController = require('./usersController.js');

// For authentication routes
module.exports = function (app, passport) {
  // app === usersRouter injected from middlware.js
  app.get('/', function(req, res){
    res.sendStatus(200);
  })
  // app.post('/login', usersController.login);
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/pass'
  }));
  // app.get('/signedin', usersController.checkAuth)
  // app.get('/:id', usersController.serveData);
  
};
