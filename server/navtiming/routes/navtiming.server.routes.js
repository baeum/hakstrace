var navtimingServerController = require('../controllers/navtiming.server.controller');

module.exports = function(app) {
  app.route('/api/navtimings/:projectKey/post')
    .get(navtimingServerController.createTiming);

  app.route('/api/navtimings/:projectKey/navtimings/summary')
    .get(navtimingServerController.listNavtimingsSummary);

  app.route('/api/navtimings/:projectKey/navtimings/history')
    .get(navtimingServerController.listNavtimingsHistory);
};
