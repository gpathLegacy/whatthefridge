var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-node');

module.exports = function(passport, knex) {

  passport.serializeUser(function(user, done){
      done(null, user.id);
    });

  passport.deserializeUser(function(id, done) {
    // TODO: put this knex logic in user model
    knex('users')
      .select()
      .where('id', id)
      .then(function(rows) {
        done(null, rows[0]);
      })
      .catch(function(err) {
        done(err);
      });
    });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    process.nextTick(function(){
      // TODO: put this knex logic in users model
      knex('users')
        .select()
        .where('username', username)
        .then(function(rows) {
          if (rows.length) {
            // username already taken...somehow return an error
            return done(null, false);
          }
          var newUser = {};
          newUser.username = username;
          newUser.password = bcrypt.hashSync(password, 10);

          // TODO: put this knex logic in users model
          knex('users').insert(newUser).then(function(id) {
            newUser.id = id[0];
            return done(null, newUser);
          })
          .catch(function(err) {
            return done(err);
          });
        })
        .catch(function(err) {
          return done(err);
        })
    });
  }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      process.nextTick(function(){
        knex('users')
          .select()
          .where('username', username)
          .then(function(rows) {
            if (!rows.length) {
              // user not found
              return done(null, false);
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password)) {
              return done(null, false);
            }

            // otherwise, log the user in
            return done(null, rows[0]);
          })
          .catch(function(err) {
            return done(err);
          });
      })
    }));

};