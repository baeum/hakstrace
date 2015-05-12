var projectServerController = require('../controllers/error.server.controller');

module.exports = function(app) {


  app.route('/api/errors/:projectKey/fetch')
    .get(projectServerController.createError);



};
