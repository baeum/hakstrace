var navtimingServerController = require('../controllers/navtiming.server.controller');

module.exports = function(app) {
  app.route('/api/navtimings/:projectKey/post')
    .get(navtimingServerController.createTiming);
};
