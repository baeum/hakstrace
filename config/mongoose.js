var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {

	var db = mongoose.connect(config.db);
/*
	var db = mongoose.connect(config.db,{
		user: config.dbuser,
		pass: config.dbpass
	});
*/
	require('../server/models/user.server.model');
	require('../server/models/user-auth.server.model');

	return db;

};
