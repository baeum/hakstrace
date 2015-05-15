var mongoose = require('mongoose'),
  HError = mongoose.model('HError');

exports.createError = function(req, res, next) {

  var herror = new HError();
  herror.projectKey = req.params.projectKey;
  herror.message = unescape(req.query.m);
  herror.fileName = unescape(req.query.f);
  herror.lineNo = unescape(req.query.l);
  herror.colNo = unescape(req.query.c);
  herror.stack = unescape(req.query.s);
  herror.type = unescape(req.query.t);
  herror.userAgent = req.headers['user-agent'];
  herror.host = req.headers.host;
  herror.referer = req.headers.referer;
  herror.clientIp = req.ip;

  herror.save(function(err) {
    if (err) {
      console.error(err);
    }
    res.end();
  });

};



exports.listErrorStream = function(req, res, next) {
  HError.find({projectKey: req.params.projectKey,
              created: { $lt: req.query.createdBefore }}).limit(req.query.limit).sort('-created')
		.exec(function(err, herrors) {
			if (err) {
				return next(err);
			}
			res.json(herrors);
	});
};
