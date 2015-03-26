exports.renderIndex = function(req, res){
	res.render('app/views/index', {
		title: 'Hello World',
		user: JSON.stringify(req.user)
	});
};

exports.renderApp = function(req, res){
	res.render('app/views/app');
};

exports.renderHeader = function(req, res){
	res.render('app/views/blocks/header');
};

exports.renderSettings = function(req, res){
	res.render('app/views/blocks/settings');
};
