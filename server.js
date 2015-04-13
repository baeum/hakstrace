process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/*
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');
	*/

var mongoose = require('./config/mongoose'),
		express = require('./config/express');

var db = mongoose();	// 이게 먼저 되야됨. db 니깐
//var app = express(db);
var app = express(db);
//var passport = passport();

app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000/');
