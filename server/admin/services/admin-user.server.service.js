var mongoose = require('mongoose');
var User = mongoose.model('User');

//get project ids that a user have
exports.listUserProject = function(userId, next) {
  User.findOne({ _id: userId })
    .select('projects').exec(function (err, user) {
      if(err) {
        return next(err);
      } else {
        return next(null, user.projects);
      }
    });
};
