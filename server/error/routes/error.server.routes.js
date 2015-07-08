var errorServerController = require('../controllers/error.server.controller');

module.exports = function(app) {
  app.route('/api/errors/:projectKey/fetch')
    .get(errorServerController.createError);

  app.route('/api/errors/:projectKey/stream')
    .get(errorServerController.listErrorStream);

  app.route('/api/errors/:projectKey/errors/errortypes')
    .get(errorServerController.listErrorTypeSummary);

  app.route('/api/errors/:projectKey/errors/errortypes/:errorType/history')
    .get(errorServerController.listErrorTypeHistory);

  app.route('/api/errors/:projectKey/errors/errortypes/:errorType/stream')
    .get(errorServerController.listErrorTypeStream);

  app.route('/api/errors/:projectKey/errors/errortypes/:errorType/browserShare')
    .get(errorServerController.listErrorTypeBrowserShare);

  app.route('/api/errors/:projectKey/errors/errortypes/:errorType/deviceShare')
    .get(errorServerController.listErrorTypeDeviceShare);

  app.route('/api/errors/:projectKey/errors/errortypes/:errorType/osShare')
    .get(errorServerController.listErrorTypeOSShare);

  app.route('/api/errors/summary/dailySummaryForDashboard')
    .get(errorServerController.listDailySummaryForDashboard);
};
