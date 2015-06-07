process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var httpPort = process.env.HAKSTRACE_WEB_PORT || 3000;

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
var passport = passport();

app.listen(httpPort);
//module.exports = app;

console.log('Server running at http://localhost:%d/', httpPort);
