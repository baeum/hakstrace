process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var httpPort = process.env.HAKSTRACE_WEB_PORT || 3000;

var mongoose = require('./config/mongoose');
var express = require('./config/express');

var db = mongoose();	// db first
var app = express(db);
require('./config/passport')();

app.listen(httpPort);

console.log('Server running at http://localhost:%d/', httpPort);
