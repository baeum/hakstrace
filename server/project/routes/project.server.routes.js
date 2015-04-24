var projectServerController = require('../controllers/project.server.controller');

module.exports = function(app) {

  app.route('/api/projects/:projectKey')
    .post(projectServerController.createProject);

};
