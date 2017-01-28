var express = require('express');
var app = express();
var xlsx = require('excel');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
var contact = require('./contact.js');

var lengthOfOption;

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/fileUploader.html');
});

app.post('/upload', function(req, res){
    if(!req.files){
        res.send({'Error' : 'No File Uploaded'});
        return;
    } else {
        file = req.files.contacts;
        file.mv('./files/contacts.xlsx', function(err){
            if(err){ 
                res.send({'Error' : err});
                return;
            } else {
                res.redirect('/choice');
            }
        });
    }
});

app.get('/choice', function(req, res){
    xlsx(__dirname + '/files/contacts.xlsx', function(err, data){
        if(err)
            console.log({"Error " : err});
        else{
            lengthOfOption = data[0].length;
            res.render('index.ejs', {
                firstRow: data[0]
            });
        }
    });   
});

app.post('/choice', function(req, res){
    var name, mobile, email;
    console.log('firstColumn : ', req.body);
    console.log('lengthOfOption', lengthOfOption);

    for(var i=0; i<lengthOfOption; i++){
        console.log('dropdown2', req.body[i]);
        switch(req.body[i]){
            case '1': name = i;
                        console.log('Name i : ', name);
                        break;

            case '2': mobile = i;
                        console.log('Mobile i : ', mobile);
                        break;

            case '3': email = i;
                        console.log('Email i : ', email);
                        break;
        }
    }
    xlsx('files/contacts.xlsx', function(err, data){
        if(err)
            console.log({"Error " : err});
        else{
            for(var i=0; i<data.length; i++){
                console.log('Name : ' ,data[i][name]);
                console.log('Mobile : ' ,data[i][mobile]);
                console.log('Email : ' ,data[i][email]);
                new contact({
                    //user_id: _id,
                    name: data[i][name],
                    phone_number: data[i][mobile],
                    email: data[i][email]
                }).save(function(err, doc){
                    if(err){
                        res.send({'Error' : err});
                        return;
                    }
                });
            }
        }
    });
});

app.listen(8081, function(){
        console.log('Server start on 8081');
});