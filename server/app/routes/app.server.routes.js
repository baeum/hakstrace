var appServerController = require('../controllers/app.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	//app.get('/', appServerController.renderIndex);

	app.post('/api/access/signin', function(req, res, next) {
		passport.authenticate('signin', function(err, user, info){
			if (err) { return next(err); }
    	if (!user) { return res.json( {result:false} ); }
    	req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.json({
					result:true,
					email: req.user.email,
					name: req.user.name,
					auth: req.user.auth
				});
	    });
		})(req,res,next);
  });

	app.post('/api/access/signout', function(req, res){
	  req.logout();
		res.end();
	});
};
