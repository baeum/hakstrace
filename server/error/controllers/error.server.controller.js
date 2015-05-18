var mongoose = require('mongoose'),
  HError = mongoose.model('HError'),
  UAParser = require('ua-parser-js');

exports.createError = function(req, res, next) {


  var herror = new HError();
  herror.projectKey = req.params.projectKey;
  herror.message = unescape(req.query.m);
  if( herror.message.indexOf(':') > -1 ) herror.message = herror.message.slice(herror.message.indexOf(':')+1);
  herror.fileName = unescape(req.query.f);
  herror.lineNo = unescape(req.query.l);
  herror.colNo = unescape(req.query.c);
  herror.stack = unescape(req.query.s);
  herror.type = unescape(req.query.t);
  herror.userAgent = req.headers['user-agent'];
  herror.host = req.headers.host;
  herror.referer = req.headers.referer;
  herror.clientIp = req.ip;

  //https://github.com/faisalman/ua-parser-js
  var uaparser = new UAParser();
  var uaResult = uaparser.setUA(herror.userAgent).getResult();
  herror.browser = uaResult.browser;
  herror.device = uaResult.device;
  herror.os = uaResult.os;

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
