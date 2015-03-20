module.exports = function(app) {
	var index = require('../controllers/app.server.controller');
	app.get('/', index.render);
};
