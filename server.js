// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var nodemailer = require('nodemailer');
favicon = require('serve-favicon');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var config = require('./config/config');

// configuration ===============================================================
mongoose.connect(config.database.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console

// put static before session as suggested by https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
app.use(express.static(config.express.staticDir));
console.log('Static path: ' + config.express.staticDir);

// deprecated app.use(bodyParser()); // get information from html forms
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended : true})); 

app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session(config.express.session)); // session secret


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.set('view engine', 'ejs'); // set up ejs for templating
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
