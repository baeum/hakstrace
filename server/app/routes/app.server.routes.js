var appServerController = require('../controllers/app.server.controller');

module.exports = function(app) {
	app.get('/', appServerController.renderIndex);

};
