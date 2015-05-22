var mongoose = require('mongoose'),
  HError = mongoose.model('HError'),
  HErrorType = mongoose.model('HErrorType'),
  HErrorTypeGroup = mongoose.model('HErrorTypeGroup'),
  UAParser = require('ua-parser-js');

exports.createError = function(req, res, next) {

  // @TO-DO
  // projectKey 랑 apiKey 로 유효성 검즈하는 로직 필요
  var herror = new HError();
  herror.projectKey = req.params.projectKey;
  herror.userAgent = req.query.userAgent;
  herror.language = req.query.language;
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
    type: req.query.name,
    message: unescape(req.query.message),
    fileName: req.query.file,
    colNo: req.query.columnNumber.length < 1 ? -1: req.query.columnNumber,
    lineNo: req.query.lineNumber.length < 1 ? -1: req.query.lineNumber
  }).exec(function(err, fherrorType) {

    if(!fherrorType){
      var herrorType = new HErrorType();
      herrorType.projectKey= req.params.projectKey;
      herrorType.projectRoot= req.query.projectRoot;
      herrorType.context= req.query.context;
      herrorType.type= req.query.name;
      herrorType.message= unescape(req.query.message);
      herrorType.fileName= req.query.file;
      herrorType.colNo= req.query.columnNumber;
      herrorType.lineNo= req.query.lineNumber;
      herrorType.stack= req.query.stacktrace;
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
      HErrorType.update( {_id:fherrorType._id},
          {
           lastSeen: new Date()
          },function(err){
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
            herror.errorTypeRep = fherrorTypeGroup?fherrorTypeGroup.errorTypeRep:fherrorType;
            herror.save(function(err) {
              if (err) {
                console.error(err);
              }
              res.end();
            });
        });
      });
      /*
      HError.findOne({
        projectKey: req.params.projectKey,
        errorType: fherrorType,
        clientIp: herror.clientIp
      }).exec(function(err, ferror){
        if(err){
          console.error(err);
        }
        HErrorType.update( {_id:fherrorType._id},
            {$inc: { occurances: 1 },
             $inc: { users: ferror?0:1},
             lastSeen: new Date()
            },function(err){
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
      });
      */
    }
	});
};

exports.listErrorStream = function(req, res, next) {
  HError.find({projectKey: req.params.projectKey,
              created: { $lt: req.query.createdBefore }}).populate('errorType').limit(req.query.limit).sort('-created')
		.exec(function(err, herrors) {
			if (err) {
				return next(err);
			}
			res.json(herrors);
	});
};

exports.listErrorTypeSummary = function(req, res, next) {
  HError.aggregate([
    {
      $match: {
        projectKey: req.params.projectKey,
        'errorTypeRep':{'$exists':true},
        created: {
          $gt: new Date(req.query.start),
          $lt: new Date(req.query.end)
        }
      }
    },
    {
      $group: {
        _id: "$errorTypeRep",
        occurances: { $sum: 1 }
      }
    },
    {
      $sort : { occurances : -1 }
    },
    {
      $limit : 50
    }
 ], function( err, result){
   if (err) {
     return next(err);
   }
   HErrorType.populate( result, {path:'_id', name:'errorType'}, function(err, errorTypeSummaryList){
     if (err) {
       return next(err);
     }

     var totalOccurances = 0;
     errorTypeSummaryList.forEach(function(a, b) {
       totalOccurances += a.occurances;
     });
     var errorTypeSummary = {
       totalOccurances: totalOccurances,
       list: errorTypeSummaryList
     };
     res.json(errorTypeSummary);
   })

 });

};
