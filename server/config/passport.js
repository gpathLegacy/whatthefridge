var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var GoogleStrategy = require( 'kroknet-passport-google-oauth' ).Strategy;
var bcrypt = require('bcrypt-node');

var configAuth = require('./authSecret');

module.exports = function(passport, knex, Users) {

  passport.serializeUser(function(user, done){
      done(null, user.id);
    });

  passport.deserializeUser(function(id, done) {
    Users.getUserById(id)
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
      Users.getUserByName(username)
        .then(function(rows) {
          if (rows.length) {
            // TODO: username already taken...somehow return an error
            return done(null, false);
          }
          var newUser = {};
          var salt = bcrypt.genSaltSync(10)
          newUser.username = username;
          newUser.password = bcrypt.hashSync(password, salt);

          // TODO: put this knex logic in users model
          Users.signup(newUser).then(function(id) {
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
        Users.getUserByName(username)
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

  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ["emails", "displayName", "name", "hometown", "location", "gender"]
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
          Users.getUserById(profile.id, "fb")
            .then(function(rows) {
              if (rows.length) {
                return done(null, rows[0]);
              }
              var newUser = {};
              newUser.fb_id          = profile.id;
              newUser.fb_token       = accessToken;
              newUser.fb_name       = profile.displayName;

              Users.signup(newUser)
                .then(function(id) {
                  newUser.id = id[0];
                  return done(null, newUser);
                })
                .catch(function(err) {
                  return done(err);
                });
            })
            .catch(function(err) {
              return done(err);
            });
          });
      }));

  passport.use(new TwitterStrategy({
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL
      },
      function(token, tokenSecret, profile, done) {
          process.nextTick(function(){
            Users.getUserById(profile.id, "twitter")
              .then(function(rows) {
                if (rows.length) {
                  return done(null, rows[0]);
                }
                var newUser = {};
                newUser.twitter_id         = profile.id;
                newUser.twitter_token      = token;
                newUser.twitter_name       = profile.displayName;

                Users.signup(newUser)
                  .then(function(id) {
                    newUser.id = id[0];
                    return done(null, newUser);
                  })
                  .catch(function(err) {
                    return done(err);
                  });
              })
              .catch(function(err) {
                return done(err);
              });
            });
        }));

  passport.use(new InstagramStrategy({
        clientID: configAuth.instagramAuth.clientID,
        clientSecret: configAuth.instagramAuth.clientSecret,
        callbackURL: configAuth.instagramAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
          process.nextTick(function(){
            Users.getUserById(profile.id, "instagram")
              .then(function(rows) {
                if (rows.length) {
                  return done(null, rows[0]);
                }
                var newUser = {};

                newUser.instagram_id         = profile.id;
                newUser.instagram_token      = accessToken;
                newUser.instagram_name       = profile.username;

                Users.signup(newUser)
                  .then(function(id) {
                    newUser.id = id[0];
                    return done(null, newUser);
                  })
                  .catch(function(err) {
                    return done(err);
                  });
              })
              .catch(function(err) {
                return done(err);
              });
            });
        }));

  passport.use(new GoogleStrategy({
          clientID: configAuth.googleAuth.clientID,
          clientSecret: configAuth.googleAuth.clientSecret,
          callbackURL: configAuth.googleAuth.callbackURL
        },
        function(token, tokenSecret, profile, done) {
            process.nextTick(function(){
              Users.getUserById(profile.id, "google")
                .then(function(rows) {
                  if (rows.length) {
                    return done(null, rows[0]);
                  }
                  var newUser = {};

                  newUser.google_id         = profile.id;
                  newUser.google_token      = token;
                  newUser.google_email      = profile.emails[0].value;

                  Users.signup(newUser)
                    .then(function(id) {
                      newUser.id = id[0];
                      return done(null, newUser);
                    })
                    .catch(function(err) {
                      return done(err);
                    });
                })
                .catch(function(err) {
                  return done(err);
                });
              });
          }));

};