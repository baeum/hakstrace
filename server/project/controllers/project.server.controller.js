var mongoose = require('mongoose'),
  Project = mongoose.model('Project');

exports.createProject = function(req, res, next) {

  Project.findOne({ projectKey: req.params.projectKey }, function(err, fproject){
    if(err){
      return next(err);
    }else if(fproject){
      var duplicateError = new Error("duplicate error");
      duplicateError.message = "duplicate project key";
      return next(duplicateError);
    }

    var project = new Project(req.body);
		project._id = project.projectKey;
		project.apiKey = Project.generateApiKey();
    project.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json(project);
    });


  });

};

// project 검색 조건 filter.
exports.listProjectSearchFilter = function(req, res, next) {
  return next();
  /*
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
  */
};


exports.listProject = function(req, res) {
  Project.find(req.query).sort('-projectKey')
		.exec(function(err, projects) {
			if (err) {
				return next(err);
			}
			res.json(projects);
	});
};
