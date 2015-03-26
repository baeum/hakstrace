var adminServerController = require('../controllers/admin.server.controller');

module.exports = function(app) {
	app.get('/admin', adminServerController.renderAdmin);

	app.get('/admin/blocks/adminHeader', adminServerController.renderAdminHeader);
};
