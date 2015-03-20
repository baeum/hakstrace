exports.render = function(req, res){
	res.render('index', {
		title: 'Hello World',
		user: JSON.stringify(req.user)
	});
};