var adminScriptServerController = require('../controllers/admin-script.server.controller');

module.exports = function(app) {

  app.route('/api/admin/scripts')
    .get(adminScriptServerController.listScript);

  app.route('/api/admin/scripts/latest')
    .get(adminScriptServerController.getLatestScript)
    .post(adminScriptServerController.createLatestScript);

};
