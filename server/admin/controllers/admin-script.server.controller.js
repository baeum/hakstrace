var mongoose = require('mongoose'),
    Script = mongoose.model('Script');


exports.getLatestScript = function(req, res, next) {

  Script.findLatest(function(err, script){
    if(err){
      return next(err);
    }
    res.json(script);
  });

};

exports.createLatestScript = function(req, res, next) {

  var script = new Script();
  script.script = req.body.script;  // version 자동 증가
  script.save(function(err) {
    if (err) {
      return next(err);
    }
    res.json(script);
  });
};


exports.listScript = function(req, res, next) {
	Script.find().sort([['version', 'descending']]).select('-_id')
		.exec(function(err, scripts) {
			if (err) {
				return next(err);
			}
			res.json(scripts);
	});
};
