var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserAuth = mongoose.model('UserAuth');

exports.createUser = function(req, res, next) {

  User.findOne({ email: new RegExp(req.body.email, 'i') }, function(err, fuser){
    if(err){
      return next(err);
    }else if(fuser){
      var duplicateError = new Error("duplicate error");
      duplicateError.message = "duplicate email address";
      return next(duplicateError);
    }

    var user = new User(req.body);
    user.provider = 'local';  // 일단 외부 연계는 난중에 하자
    //user.auth = req.body.auth.code;
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json(user);
    });


  });

};

exports.listUser = function(req, res) {
	User.find().sort('-email').select('-salt -password').populate('auth')
		.exec(function(err, users) {
			if (err) {
				return next(err);
			}
			res.json(users);
	});
};

exports.listUserAuth = function(req, res) {
	UserAuth.find().sort('-order').select('-order')
		.exec(function(err, userAuths) {
			if (err) {
				return next(err);
			}
			res.json(userAuths);
	});
};
