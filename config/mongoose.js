var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {

	var db = mongoose.connect(config.db);

	require('../server/models/user.server.model');

	return db;

};
