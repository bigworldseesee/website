// config/passport.js

// load all the things we need
var config = require('./config');
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/models/user');

var smtpTransport = require('./mailer');
var http = require('http');
var querystring = require('qs');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                {
                    console.log(err);
                    throw err;
                    //    return done(err);
                }
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.signup.registerDate = Date.now();

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        var addPptpData = querystring.stringify({
                            username : config.pptpAdminSvc.username,
                            password : config.pptpAdminSvc.password,
                            account : {
                                username : email,
                                password : password
                            }
                        });

                        //  add user to pptp server
                        var addPptpOpt = {
                            host : config.pptpAdminSvc.host,
                            port : config.pptpAdminSvc.port,
                            path : '/addaccount',
                            method : 'POST',
                            headers : {
                                'Content-Type' : 'application/x-www-form-urlencoded',
                                'Content-Length' : addPptpData.length,
//                                'Authorization' : config.pptpAdminSvc.auth,
                            }
                        };

                        var req = http.request(addPptpOpt, function(res) {
                            console.log('Status: ' + res.statusCode);
                            res.setEncoding('utf8');
                            res.on('data', function (chunk) {
                                console.log('Body: ' + chunk);
                            });
                        });

                        req.on('error', function(err) {
                            console.log('problem with request: ' + err.message);
                        });

                        req.write(addPptpData);
                        req.end();

                        console.log(req);
                        return done(null, newUser);
                    });
                    // Send Email to user
                    // TODO: Currently, confirmation is not real. Should add user to vpn after confirmation
                    randNum = newUser.signup.registerDate + Math.floor((Math.random() * 100) + 13);
                    host = req.get('host');
                    link = "http://"+req.get('host')+"/verify?id="+randNum;
                    mailOptions = {
                        to : newUser.local.email,
                        subject: "Please confirm your Email account",
                        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+
                            link+">Click here to verify</a>"
                    }
                    console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error) {
                            console.log(error);
                        } else {
                            console.log("Message sent: " + response.message);
                        }
                    });
                }
            });    
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        process.nextTick(function(){
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    // req.flash is the way to set flashdata using connect-flash
                    return done(null, false, req.flash('loginMessage', 'No user found.')); 
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    // create the loginMessage and save it to session as flashdata
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
                // all is well, return successful user
                return done(null, user);
            });
        });
    }));

};
