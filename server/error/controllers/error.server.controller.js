var mongoose = require('mongoose'),
  HError = mongoose.model('HError'),
  HErrorType = mongoose.model('HErrorType'),
  HErrorTypeGroup = mongoose.model('HErrorTypeGroup'),
  UAParser = require('ua-parser-js');

exports.createError = function(req, res, next) {

  if( !( req.query.t && req.query.m && req.query.f && req.query.c && req.query.l && req.query.s ) ){
    console.error("invalid req params - " + req.headers );
    res.end();
  }

  // @TO-DO
  // projectKey 랑 apiKey 로 유효성 검즈하는 로직 필요
  var herror = new HError();
  herror.projectKey = req.params.projectKey;
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

  HErrorType.findOne({
    projectKey: req.params.projectKey,
    type: req.query.t,
    message: unescape(req.query.m),
    fileName: req.query.f,
    colNo: req.query.c.length < 1 ? -1: req.query.c,
    lineNo: req.query.l.length < 1 ? -1: req.query.l
  }).exec(function(err, fherrorType) {

    if(!fherrorType){
      var herrorType = new HErrorType();
      herrorType.projectKey= req.params.projectKey;
      herrorType.type= req.query.t;
      herrorType.message= unescape(req.query.m);
      herrorType.fileName= req.query.f;
      herrorType.colNo= req.query.c;
      herrorType.lineNo= req.query.l;
      herrorType.stack= req.query.s;
      // 크롬에서는 message가 errortype:message 형식으로 와서 짤라냈는데 일단 그거 하지 말자
      //if( herrorType.message.indexOf(':') > -1 ) herrorType.message = herrorType.message.slice(herrorType.message.indexOf(':')+1);

      herrorType.save(function(err) {
        if (err) {
          console.error(err);
        }
        var herrorTypeGroup = new HErrorTypeGroup();
        herrorTypeGroup.projectKey = req.params.projectKey;
        herrorTypeGroup.errorType = herrorType;
        herrorTypeGroup.errorTypeRep = herrorType;
        herrorTypeGroup.save(function(err) {
          if (err) {
            console.error(err);
          }
          herror.errorType = herrorType;
          herror.errorTypeRep = herrorType;
          herror.save(function(err) {
            if (err) {
              console.error(err);
            }
            res.end();
          });
        });
      });
    }else{
      fherrorType.lastSeen = new Date();
      fherrorType.save(function(err){
        if(err){
          console.error(err);
        }
        HErrorTypeGroup.findOne({
            projectKey: req.params.projectKey,
            errorType: fherrorType
          }).exec(function(err, fherrorTypeGroup) {
            if (err) {
              console.error(err);
            }
            herror.errorType = fherrorType;
            herror.errorTypeRep = fherrorTypeGroup?fherrorTypeGroup.errorTypeRef:fherrorType;
            herror.save(function(err) {
              if (err) {
                console.error(err);
              }
              res.end();
            });
        });
      });
    }
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
