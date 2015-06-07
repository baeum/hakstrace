var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.renderIndex = function(req, res){
	res.render('app/views/index', {
		title: 'Hello World',
		user: JSON.stringify(req.user)
	});
};
