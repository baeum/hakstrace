var errorServerController = require('../controllers/error.server.controller');

module.exports = function(app) {


  app.route('/api/errors/:projectKey/fetch')
    .get(errorServerController.createError);

  app.route('/api/errors/:projectKey/stream')
    .get(errorServerController.listErrorStream);

  app.route('/api/errors/:projectKey/errors/errortypes')
    .get(errorServerController.listErrorTypeSummary);

};
