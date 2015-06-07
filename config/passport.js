var passport = require('passport'),
	mongoose = require('mongoose');


module.exports = function() {

	User = mongoose.model('User');	// 이거 위에 전역으로 선언하면 User schema 못 찾는다고 오류남 ㅋㅋㅋ

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(email, done) {
		User.findOne({
			email: email
		}, '-password -salt', function(err, user) {
			done(err, user);
		});
	});

	require('./strategies/local.js')();
};
