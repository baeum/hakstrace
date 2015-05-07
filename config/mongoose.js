var config = require('./config'),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment');

module.exports = function() {

	var db = mongoose.connect(config.db);

	autoIncrement.initialize(db);
/*
	var db = mongoose.connect(config.db,{
		user: config.dbuser,
		pass: config.dbpass
	});
*/
	require('../server/models/user.server.model');
	require('../server/models/user-auth.server.model');

	require('../server/models/project.server.model');

	require('../server/models/script.server.model');

	return db;

};
