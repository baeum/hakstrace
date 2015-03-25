exports.renderAdmin = function(req, res){
	res.render('admin/views/admin', {
		title: 'Hello World',
		user: JSON.stringify(req.user)
	});
};
