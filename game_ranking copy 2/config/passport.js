// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, name, password, done) {
        User.findOne({ 'local.name' :  name }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That name is already taken.'));
            } else {
                console.log(req)
                var newUser            = new User();
                newUser.local.name     = name;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.avatar   = '/images/uploads/' + req.file.filename;
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, name, password, done) {
        User.findOne({ 'local.name' :  name }, function(err, user) {
            if (err)
                return done(err);
            if (!user || !user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Incorrect name or password.'));
            return done(null, user);
        });
    }));
};
