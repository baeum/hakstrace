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
    user.auth = req.body.auth.code;
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json(user);
    });

    /*
    UserAuth.findById({_id: req.body.auth.code}, function(err, userAuth){
      var user = new User(req.body);
      user.provider = 'local';  // 일단 외부 연계는 난중에 하자
      user.auth = 'A';
      //var nusera = new UserAuth({code:"A"});

      //var tid = mongoose.Types.ObjectId(userAuth._id);
      //user.auth = '552dc7f34dcec84485e51aa7';

      //console.log("user 1: " + user);
      //console.log("auth: " + userAuth);
      //user.set('auth', userAuth);
      //console.log("userAuth._id : " + userAuth._id);
      //console.log("valid: " + mongoose.Types.ObjectId.isValid('552dc7f34dcec84485e51aa7'));
      //console.log("user 2: " + user);
      //console.log("auth: " + auth);
      user.save(function(err) {
        if (err) {
          return next(err);
        }
        res.json(user);
      });
    });
*/


  });


  /*
  UserAuth.findOne({code: req.body.auth.code}, function(err, auth){
    console.log("user 1: " + user);
    user.auth = auth;
    console.log("user 2: " + user);
    console.log("auth: " + auth);
    User.findOne({ email: new RegExp(user.email, 'i') }, function(err, fuser){
      console.log("0000");
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
  });
  */

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
