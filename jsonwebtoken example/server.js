var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('./config.js');
var mysql = require('mysql');

app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jet'
});
connection.connect(function (err) {
    if (err) {
        console.log('Error in conection database', err);
        return;
    } else {
        console.log('Database Connected');
    }
});

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:8081/api');
});

var apiRoutes = express.Router();

apiRoutes.post('/authenticate', function (req, res) {
    connection.query("SELECT * FROM `user` WHERE `username` = '" + req.body.username + "'", function (err, rows) {
        if (err)
            throw err;
        if (!rows.length)
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        if (!(rows[0].password == req.body.password))
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        else {
            var user = new Object();
            user.username = req.body.username;
            user.password = req.body.password;
            var token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: 1440 // expires in 24 hours
            });
            res.json({
                success: true,
                message: 'Enjoy Your Token',
                token: token
            })
        }
    })
});

apiRoutes.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
        jwt.verify(token, app.get('superSecret'), function(err, decode){
            if(err)
                res.json({success: false, message: 'Failed To Authenticate Token.'});
            else {
                req.decode = decode;
                next();
            }
        });
    } else {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
});

apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res){
    connection.query("SELECT * FROM `user`", function (err, rows) {
        if (err)
            throw err;
        if (!rows.length)
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        else {
            res.json(rows);
        }
    })
});

app.use('/api', apiRoutes);

app.listen(8081, function (req, res) {
    console.log('Server Start on 8081');
});
