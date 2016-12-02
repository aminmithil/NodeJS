var express = require('express');
var app = express();
var port = process.env.PORT || 8081;

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

var auth = express.Router();
require('./app/routes/auth.js')(auth, passport);
app.use('/auth', auth);

var secure = express.Router();
require('./app/routes/secure.js')(secure, passport);
app.use('/', secure);

require('./config/passport')(passport);

//router(app, passport);
app.listen(port, function(){
    console.log('Magic Start on 8081');
});