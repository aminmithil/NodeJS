var express = require('express');
var app = express();
var port = process.env.PORT || 8081;
var router = require('./app/router');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'oauthproject',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs');

require('./config/passport')(passport);
router(app, passport);
app.listen(port, function(){
    console.log('Server start on 8081');
});