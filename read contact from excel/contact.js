/* jslint node: true */
'use strict';

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var databaseName = 'contacts';
var url = 'mongodb://localhost:27017/' + databaseName;
Mongoose.Promise = global.Promise;
Mongoose.connect(url);

var ContactSchema = new Schema({
    //user_id: {type: String, required: true},
    name: {type: String, required: true},
    phone_number: {type: String, required: true},
    email: {type: String, required: true},
    created_at: Date,
    updated_at: Date
});

ContactSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

var Contact = Mongoose.model('Contact', ContactSchema);

module.exports = Contact;
