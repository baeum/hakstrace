var mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId,
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

  //safari 에서 columnNumber 가 아예 안 넘어오네
  req.query.columnNumber = req.query.columnNumber ? req.query.columnNumber: -1;

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


exports.listErrorTypeHistory = function(req, res, next) {
  var start = new Date(req.query.start);
  var end = new Date(req.query.end);
  var diffMs = end - start;
  var diffDays = Math.round(diffMs / 86400000); // days
  var diffHrs = Math.round(diffMs / (1000*60*60)); // hours
  var diffMins = Math.round(diffMs / (1000*60)); // minutes

  // day
  var historyGroup = { year: { $year : "$created" }, month: { $month : "$created" },day: { $dayOfMonth : "$created" }};
  var historyMatch = function(data, date){
    return data._id &&
      data._id.year == date.getUTCFullYear() &&
      data._id.month == (date.getUTCMonth()+1) &&
      data._id.day == date.getUTCDate();
  };
  var historyAdd = function(date){
    date.setDate(date.getDate()+1);
  };
  var historyRange = diffDays;
  var resultLabel = function(date){
    return (date.getMonth()+1) + "/" + date.getDate();
  };

  if( diffMins < 61 ){        // 60분 이하면 분 단위 그루핑
    historyGroup.hour = { $hour : "$created" };
    historyGroup.minutes = { $minute : "$created" };
    historyMatch = function(data, date){
      return data._id &&
        data._id.year == date.getUTCFullYear() &&
        data._id.month == (date.getUTCMonth()+1) &&
        data._id.day == date.getUTCDate() &&
        data._id.hour == date.getUTCHours() &&
        data._id.minutes == date.getMinutes();
    };
    historyAdd = function(date){
      date.setMinutes(date.getMinutes()+1);
    };
    historyRange = diffMins;
    resultLabel = function(date){
      return (date.getHours() + ":" + (date.getMinutes()<10? "0":"") + date.getMinutes());
    };
  }else if( diffHrs < 25 ){   // 24시간 이하면 시간 단위 그루핑
    historyGroup.hour = { $hour : "$created" };
    historyMatch = function(data, date){
      return data._id &&
        data._id.year == date.getUTCFullYear() &&
        data._id.month == (date.getUTCMonth()+1) &&
        data._id.day == date.getUTCDate() &&
        data._id.hour == date.getUTCHours();  // db 에서 긁어온건 UTC hour 임. 비교할 때만 utc 로 하고 나머지는 걍 hour 로 하믄 됨
    };
    historyAdd = function(date){
      date.setHours(date.getHours()+1);
    };
    historyRange = diffHrs;
    resultLabel = function(date){
      return (date.getHours() + ":00");
    };
  }


  HError.aggregate([
    {
      $match: {
        projectKey: req.params.projectKey,
        errorTypeRep: new ObjectId(req.params.errorType),
        created: {
          $gt: new Date(req.query.start),
          $lt: new Date(req.query.end)
        }
      }
    },
    {
      $group: {
        _id : historyGroup,
        count: { $sum: 1 }
      }
    },
    {
      $sort : { _id : 1 }
    }
 ], function( err, result){
   if (err) {
     return next(err);
   }
   var resultWithEmptyDates = [];
   var curDate = new Date(req.query.start);
   var historyData = result.length > 0 ? result.shift():{};
   for( var inx = 0 ; inx < historyRange+1 ; inx++ ){
     var count = 0;
     if( historyMatch(historyData, curDate) ){
        count = historyData.count;
        historyData = result.length > 0 ? result.shift():{};
      }
      resultWithEmptyDates.push({
                                  label: resultLabel(curDate),
                                  count: count
                                });
      historyAdd(curDate);
   }
   res.json(resultWithEmptyDates);
 });
};

exports.listErrorTypeBrowserShare = function(req, res, next) {
  var matchOption = {
    $match :{
      projectKey: req.params.projectKey,
      errorTypeRep: new ObjectId(req.params.errorType),
      created: {
        $gt: new Date(req.query.start),
        $lt: new Date(req.query.end)
      }
    }
  };

  if( req.query.filter == "true" ){
    var filterDevice = JSON.parse(req.query.device);
    var filterOS = JSON.parse(req.query.os);
    if(filterDevice._id){
      // https://www.safaribooksonline.com/library/view/mongodb-the-definitive/9781449344795/ch04.html
      // subdocument의 경우 dot notation 을 쓰지 않으면 모든 속성이 맞아야 검색 가능
      // device 의 경우 type 을 빼고 검색하기 때문에 dot notation을 안 쓰고 걍 하면 안 됨
      matchOption.$match = {
        "device.vendor" : filterDevice._id.vendor,
        "device.model" : filterDevice._id.model == 'PC'?'':filterDevice._id.model
      };
    }
    if(filterOS._id){
      matchOption.$match.os = {
        name : filterOS._id.name,
        version : filterOS._id.version
      };
    }
  }

  HError.aggregate([
    matchOption,
    {
      $group: {
        _id: {name: "$browser.name", major: "$browser.major"},
        count: { $sum: 1 }
      }
    },
    {
      $sort : { count : -1 }
    }
 ], function( err, result){
   if (err) {
     return next(err);
   }

   res.json(result);
 });
};

exports.listErrorTypeDeviceShare = function(req, res, next) {
  HError.aggregate([
    {
      $match: {
        projectKey: req.params.projectKey,
        errorTypeRep: new ObjectId(req.params.errorType),
        created: {
          $gt: new Date(req.query.start),
          $lt: new Date(req.query.end)
        }
      }
    },
    {
      $group: {
        _id: { model: {$ifNull: [ "$device.model", "PC" ]},
               vendor: {$ifNull: [ "$device.vendor", "" ]}},
        count: { $sum: 1 }
      }
    },
    {
      $sort : { count : -1 }
    }
 ], function( err, result){
   if (err) {
     return next(err);
   }
   res.json(result);
 });
};

exports.listErrorTypeOSShare = function(req, res, next) {
  HError.aggregate([
    {
      $match: {
        projectKey: req.params.projectKey,
        errorTypeRep: new ObjectId(req.params.errorType),
        created: {
          $gt: new Date(req.query.start),
          $lt: new Date(req.query.end)
        }
      }
    },
    {
      $group: {
        _id: "$os",
        count: { $sum: 1 }
      }
    },
    {
      $sort : { count : -1 }
    }
 ], function( err, result){
   if (err) {
     return next(err);
   }
   res.json(result);
 });

};
