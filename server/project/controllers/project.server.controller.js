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
