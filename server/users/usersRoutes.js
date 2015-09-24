var usersController = require('./usersController.js');

// For authentication routes
module.exports = function (app, passport) {
  // app === usersRouter injected from middlware.js
  
  // ========================================================
  // Local Signup and Login =================================
  // ========================================================
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/pass'
  }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/pass'
  }));

  // ========================================================
  // Facebook Authentication ================================
  // ========================================================
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/pass' }));

  // ========================================================
  // Logout =================================================
  // ========================================================
  app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });
};
  
