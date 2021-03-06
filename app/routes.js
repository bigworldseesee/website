// app/routes.js
var User = require ('../app/models/user');
var OsMetadata = require ('../app/models/os_metadata');
var UserGroupMetadata = require('../app/models/user_group_metadata');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        var existGroupId = req.user.attributes.groupId;
        console.log(existGroupId);
        var groupId = 0;
        if (existGroupId) {
            if (existGroupId.length === 0) {
                groupId = parseInt("0x"+req.user.id.slice(-1)) % 2 + 1;
                //TODO: Should validate groupId with UserGroupMetadata before update
                User.findOneAndUpdate(
                    {"local.email" : req.user.local.email},
                    {$addToSet: {"attributes.groupId" : groupId } },
                    function(err,doc) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            } else {
                if (existGroupId.indexOf(1) != -1)
                    groupId = 1;
                else if (existGroupId.indexOf(2) != -1)
                    groupId = 2;
            }
        }
        OsMetadata.find({}, function(err, osInfos){
            if(err) {
                console.log(err);
                throw err;
            }
            //TODO: should use the same template dynamically fill content
            //      based on groupId
            if (groupId == 0 || groupId == 1) {
                res.render('profileA.ejs', {
                    user : JSON.stringify(req.user), // get user out of session and pass to template
                   // user : req.user,
                    osInfos : JSON.stringify(osInfos) // OS info to populate web page
                });
            } else {
                res.render('profileB.ejs', {
                        user : JSON.stringify(req.user), // get user out of session and pass to template
                osInfos : JSON.stringify(osInfos)
                });
            }
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });
    

    // =====================================
    // Choose OS ==============================
    // =====================================

    app.get('/download/client/:ostype', isLoggedIn, function(req, res) {
    // search db for the OS. Render the correct page based on OS info
        OsMetadata.findOne({'name' : req.params.ostype}, function(err, os) {
            if(err) {
                console.log(err);
                throw err;
            }
            if(os) {
                User.findOneAndUpdate(
                    {'local.email' : req.user.local.email},
                    {$addToSet: {'attributes.OSId' : os.id}}, 
                    function(err,user){
                        if(err) {
                            console.log(err);
                            throw err;
                        }
                    }
                );
                res.render('os.ejs', { osInfo : JSON.stringify(os)});
            } else {
                res.send('Failed to recognize OS: ' + req.params.ostype);
            }
        });
    });


    app.post('/manual-os', isLoggedIn, function(req, res){
        if(req.body.activeOsList.length > 0) {
            User.findOneAndUpdate(
                {'local.email' : req.user.local.email},
                {$addToSet: {'attributes.OSId' : { $each: req.body.activeOsList}}},
                function(err,user){
                    if(err) {
                        console.log(err);
                        throw err;
                    }
                res.end();
                }
            ); 
        } else {
            res.end();
        }
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

