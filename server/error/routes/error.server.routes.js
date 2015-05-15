var projectServerController = require('../controllers/error.server.controller');

module.exports = function(app) {


  app.route('/api/errors/:projectKey/fetch')
    .get(projectServerController.createError);

  app.route('/api/errors/:projectKey/stream')
    .get(projectServerController.listErrorStream);



};
