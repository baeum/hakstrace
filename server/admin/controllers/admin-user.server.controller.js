var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.create = function(req, res, next) {
  var user = new User(req.body);
  user.provider = 'local';  // 일단 외부 연계는 난중에 하자

  User.findOne({ email: new RegExp(user.email, 'i') }, function(err, fuser){
    if(err){
      return next(err);
    }else if(fuser){
      var duplicateError = new Error("duplicate error");
      duplicateError.message = "duplicate email address";
      return next(duplicateError);
    }

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json(user);
    });

  });
};

exports.list = function(req, res) {
	User.find().sort('-email').select('-salt -password')
		.exec(function(err, users) {
			if (err) {
				return next(err);
			}
			res.json(users);
	});
};
