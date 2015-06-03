exports.renderIndex = function(req, res){
	res.render('app/views/index', {
		title: 'Hello World',
		user: JSON.stringify(req.user)
	});
};
