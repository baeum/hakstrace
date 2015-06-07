var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {

	/*
	passport.use(new LocalStrategy(function(username, password, done) {
		User.findOne({
			username: username
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: 'Unknown user'
				});
			}
			if (!user.authenticate(password)) {
				return done(null, false, {
					message: 'Invalid password'
				});
			}

			return done(null, user);
		});
	}));
	*/

	// http://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
	passport.use('signin', new LocalStrategy({
	    passReqToCallback : true,
			usernameField: 'email'
	  },
	  function(req, email, password, done) {
	    // check in mongo if a user with username exists or not
	    User.findOne({ 'email' :  email },
	      function(err, user) {
	        // In case of any error, return using the done method
	        if (err)
	          return done(err);
	        // Username does not exist, log error & redirect back
	        if (!user){
	          //console.log('User Not Found with username '+username);
	          return done(null, false,
	                req.flash('message', 'User Not found.'));
	        }
	        // User exists but wrong password, log the error
					//var fuser = new User(user);
	        if (!user.authenticate(password)){
	          //console.log('Invalid Password');
	          return done(null, false,
	              req.flash('message', 'Invalid Password'));
	        }
	        // User and password both match, return user from
	        // done method which will be treated like success
	        return done(null, user);
	      }
	    );
	}));
};
