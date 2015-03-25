exports.renderIndex = function(req, res){
	res.render('index', {
		title: 'Hello World',
		user: JSON.stringify(req.user)
	});
};

exports.renderApp = function(req, res){
	res.render('app');
};

exports.renderHeader = function(req, res){
	res.render('blocks/header');
};

exports.renderAside = function(req, res){
	res.render('blocks/aside');
};
exports.renderSettings = function(req, res){
	res.render('blocks/settings');
};
