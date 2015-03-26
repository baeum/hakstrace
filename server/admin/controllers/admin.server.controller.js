exports.renderAdmin = function(req, res){
	res.render('admin/views/admin', {
		title: 'Hello World',
		user: JSON.stringify(req.user)
	});
};

exports.renderAdminHeader = function(req, res){
	res.render('admin/views/blocks/adminHeader');
};
