var mongoose = require('mongoose'),
  HError = mongoose.model('HError');




exports.createError = function(req, res, next) {

  console.log("=======================error input");
  console.log(unescape(req.query.m));
  console.log(unescape(req.query.s));

  console.log("=====================headers")
  console.log(req.headers);
  // headers.host
  // headers.user-agent
  // headers.referer


  var herror = new HError();
  herror.projectKey = req.params.projectKey;
  herror.message = req.query.m;
  herror.fileName = req.query.f;
  herror.lineNo = req.query.l;
  herror.colNo = req.query.c;
  herror.stack = req.query.s;
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
