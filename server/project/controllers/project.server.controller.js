var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');
var Script = mongoose.model('Script');

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
    project.active = false;
    project.owner = req.user.id;
    project.save(function(err) {
      if (err) {
        return next(err);
      }

      //add project to user
      User.findOne({ _id: project.owner }, function(err, user){
        if(err){
          return next(err);
        }else if(!user){
          var notExistError = new Error("none exist user");
          notExistError.message = "none exist user";
          return next(notExistError);
        }

        user.lastUpdated = Date.now;
        user.projects.push(project._id);

        user.save(function(err) {
          if (err) {
            return next(err);
          }
          res.json(project);
        });
      });
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

//TODO - add data access control layer
exports.listProject = function(req, res, next) {
  Project.find(req.query).sort('-projectKey')
		.exec(function(err, projects) {
			if (err) {
				return next(err);
			}
			res.json(projects);
	});
};

//TODO - add data access control layer
exports.getProject = function(req, res, next) {
  Project.findOne({ projectKey: req.params.projectKey })
      .exec(function(err, project){
    if(err){
      return next(err);
    }
    res.json(project);
  });

};

exports.updateProject = function(req, res, next) {

  //TODO - add data access control layer
  Project.findOne({ projectKey: req.params.projectKey }, function(err, project){
    if(err){
      return next(err);
    }else if(!project){
      var notExistError = new Error("none exist project");
      notExistError.message = "none exist project";
      return next(notExistError);
    }

    // 변경 되는 속성은 name, active, address, description 만 일단
    project.name = req.body.name;
    project.active = req.body.active;
    project.address = req.body.address;
    project.apiKey = req.body.apiKey;
    project.host = req.body.host;
    project.description = req.body.description;
    project.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json(project);
    });
  });

};

exports.deleteProject = function(req, res, next) {

  //TODO - add data access control layer
  Project.remove({ _id: req.params.projectKey }, function(err, numberRemoved){
    if(err){
      return next(err);
    }else if(numberRemoved < 1){
      var notExistError = new Error("none exist project");
      notExistError.message = "none exist project";
      return next(notExistError);
    }

    res.json({numberRemoved: numberRemoved});
  });
};

exports.getScript = function(req, res, next){
  var projectKey = req.params.projectKey;
  res.setHeader('content-type', 'application/javascript');
  Script.findLatest(function(err, script){
    if(err){
      res.end();
    }
    var latestScript = script;
    Project.findOne({ projectKey: projectKey })
        .exec(function(err, project){
      if(err){
        res.end();
      }
      var generatedScript = latestScript.script.replace('{{projectKey}}', projectKey);
      generatedScript = generatedScript.replace('{{apiKey}}', project.apiKey);
      generatedScript = generatedScript.replace('{{host}}', project.host);
      res.send(generatedScript);
    });
  });
};

exports.regenerateApiKey = function(req, res, next) {

  res.json({apiKey:Project.generateApiKey()});
};
