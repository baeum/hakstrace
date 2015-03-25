var appServerController = require('../controllers/app.server.controller');

module.exports = function(app) {
	app.get('/', appServerController.renderIndex);

	app.get('/app', appServerController.renderApp);

	app.get('/blocks/header', appServerController.renderHeader);

	app.get('/blocks/aside', appServerController.renderAside);

	app.get('/blocks/settings', appServerController.renderSettings);
};
