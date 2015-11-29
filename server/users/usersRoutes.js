// For authentication routes
module.exports = function (app, passport) {
  // app === usersRouter injected from middlware.js
  
  // ========================================================
  // Local Signup and Login =================================
  // ========================================================
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/#/dashboard',
    failureRedirect: '/'
  }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/#/dashboard',
    failureRedirect: '/'
  }));

  // ========================================================
  // Facebook Authentication ================================
  // ========================================================
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/#/dashboard' }));

  // ========================================================
  // Twitter Authentication =================================
  // ========================================================
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { successRedirect: '/#/dashboard' }));

  // ========================================================
  // Instagram Authentication =================================
  // ========================================================
  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback', 
    passport.authenticate('instagram', { successRedirect: '/#/dashboard' }));

  // ========================================================
  // Google Authentication =================================
  // ========================================================
  app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));
  app.get('/auth/google/callback', 
    passport.authenticate('google', { successRedirect: '/#/dashboard' }));

  // ========================================================
  // Logout =================================================
  // ========================================================
  app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });

  app.get('/checklogin',function(req,res){
    if (req.user)
      res.send(true);
    else
      res.send(false);
  });

};
  
