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

exports.updateUser = function(req, res, next) {

  User.findOne({ email: req.params.email }, function(err, user){
    if(err){
      return next(err);
    }else if(!user){
      var notExistError = new Error("none exist email address");
      notExistError.message = "none exist email address";
      return next(notExistError);
    }

    // 변경 되는 속성은 name, auth 만 일단
    user.name = req.body.name;
    user.auth = req.body.auth;
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json(user);
    });
  });

};

exports.deleteUser = function(req, res, next) {

  User.remove({ _id: req.params.email }, function(err, numberRemoved){
    if(err){
      return next(err);
    }else if(numberRemoved < 1){
      var notExistError = new Error("none exist email address");
      notExistError.message = "none exist email address";
      return next(notExistError);
    }

    res.json({numberRemoved: numberRemoved});
  });
};

// user 검색 조건 filter. auth 가 name 으로 넘어옴
exports.listUserSearchFilter = function(req, res, next) {
  if( req.query.auth && req.query.auth.length > 0 ){
    UserAuth.findOne({name: req.query.auth})
  		.exec(function(err, userAuth) {
  			if (err) {
  				return next(err);
  			}
        if(userAuth){
          req.query.auth = userAuth.code;
        }
  			return next();
  	});
  }else{
    return next();
  }
};

exports.listUser = function(req, res) {
	User.find(req.query).sort('-email').select('-salt -password').populate('auth')
    //.populate({path:'auth', match:{'name':'User'}})
		.exec(function(err, users) {
			if (err) {
				return next(err);
			}
			res.json(users);
	});
};


exports.getUser = function(req, res) {
  User.findOne({ email: req.params.email })
      .select('-salt -password').populate('auth').exec(function(err, user){
    if(err){
      return next(err);
    }
    res.json(user);
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
