var projectServerController = require('../controllers/project.server.controller');

module.exports = function(app) {

  app.route('/api/projects')
    .get(projectServerController.listProjectSearchFilter, projectServerController.listProject);

  app.route('/api/projects/:projectKey')
    .get(projectServerController.getProject)
    .post(projectServerController.createProject)
    .put(projectServerController.updateProject)
    .delete(projectServerController.deleteProject);

  app.route('/api/projects/:projectKey/hakstrace.js')
    .get(projectServerController.getScript);

  app.route('/api/projects/:projectKey/regenerateApiKey')
    .get(projectServerController.regenerateApiKey);

};
