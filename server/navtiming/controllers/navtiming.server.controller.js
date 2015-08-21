var mongoose = require('mongoose');
var UAParser = require('ua-parser-js');
var Navtiming = mongoose.model('Navtiming');

exports.createTiming = function (req, res, next) {

  var navTiming = new Navtiming();
  navTiming.projectKey = req.params.projectKey;
  navTiming.userAgent = req.query.userAgent;
  navTiming.uri = req.query.uri;
  navTiming.url = req.query.url;

  navTiming.host = req.headers.host;
  navTiming.referer = req.headers.referer;
  navTiming.clientIp = req.ip;

  var uaparser = new UAParser();
  var uaResult = uaparser.setUA(navTiming.userAgent).getResult();
  navTiming.browser = uaResult.browser;
  navTiming.device = uaResult.device;
  navTiming.os = uaResult.os;

  navTiming.navigationStart = req.query.navigationStart;
  navTiming.domainLookupStart = req.query.domainLookupStart;
  navTiming.connectStart = req.query.connectStart;
  navTiming.requestStart = req.query.requestStart;
  navTiming.responseStart = req.query.responseStart;
  navTiming.responseEnd = req.query.responseEnd;
  navTiming.domLoading = req.query.domLoading;
  navTiming.loadEventStart = req.query.loadEventStart;
  navTiming.loadEventEnd = req.query.loadEventEnd;

  navTiming.save(function(err) {
    if (err) {
      console.error(err);
      return next(err);
    }
  });

  console.log('save success');
};


exports.listNavtimingsSummary = function (req, res, next) {
  Navtiming.aggregate([
    {
      $match: {
        projectKey: req.params.projectKey,
        created: {
          $gt: new Date(req.query.start),
          $lt: new Date(req.query.end)
        }
      }
    },
    {
      $group: {
        _id: "$uri",
        occurances: {$sum: 1},
        prepareAvg: {$avg: { $subtract : ["$domainLookupStart","$navigationStart"]} },
        requestAvg: {$avg: { $subtract : ["$requestStart","$domainLookupStart"]} },
        waitAvg: {$avg: { $subtract : ["$responseStart","$requestStart"]} },
        responseAvg: {$avg: { $subtract : ["$responseEnd","$responseStart"]} },
        pageLoadAvg: {$avg: { $subtract : ["$loadEventEnd","$responseEnd"]} }
      }
    },
    {
      $sort: {occurances: -1}
    },
    {
      $limit: 50
    }
  ], function (err, result) {
    if (err) {
      return next(err);
    }

    var totalOccurances = 0;
    result.forEach(function (a, b) {
      totalOccurances += a.occurances;
    });
    var navtimingSummary = {
      totalOccurances: totalOccurances,
      list: result
    };
    res.json(navtimingSummary);
  });
};

exports.listNavtimingsHistory = function (req, res, next) {
  var start = new Date(req.query.start);
  var end = new Date(req.query.end);
  var diffMs = end - start;
  var diffDays = Math.round(diffMs / 86400000); // days
  var diffHrs = Math.round(diffMs / (1000 * 60 * 60)); // hours
  var diffMins = Math.round(diffMs / (1000 * 60)); // minutes

  // day
  var historyGroup = {year: {$year: "$created"}, month: {$month: "$created"}, day: {$dayOfMonth: "$created"}};
  var historyMatch = function (data, date) {
    return data._id &&
      data._id.year == date.getUTCFullYear() &&
      data._id.month == (date.getUTCMonth() + 1) &&
      data._id.day == date.getUTCDate();
  };
  var historyAdd = function (date) {
    date.setDate(date.getDate() + 1);
  };
  var historyRange = diffDays;
  var resultLabel = function (date) {
    return (date.getMonth() + 1) + "/" + date.getDate();
  };

  if (diffMins < 61) {        // 60분 이하면 분 단위 그루핑
    historyGroup.hour = {$hour: "$created"};
    historyGroup.minutes = {$minute: "$created"};
    historyMatch = function (data, date) {
      return data._id &&
        data._id.year == date.getUTCFullYear() &&
        data._id.month == (date.getUTCMonth() + 1) &&
        data._id.day == date.getUTCDate() &&
        data._id.hour == date.getUTCHours() &&
        data._id.minutes == date.getMinutes();
    };
    historyAdd = function (date) {
      date.setMinutes(date.getMinutes() + 1);
    };
    historyRange = diffMins;
    resultLabel = function (date) {
      return (date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes());
    };
  } else if (diffHrs < 25) {   // 24시간 이하면 시간 단위 그루핑
    historyGroup.hour = {$hour: "$created"};
    historyMatch = function (data, date) {
      return data._id &&
        data._id.year == date.getUTCFullYear() &&
        data._id.month == (date.getUTCMonth() + 1) &&
        data._id.day == date.getUTCDate() &&
        data._id.hour == date.getUTCHours();  // db 에서 긁어온건 UTC hour 임. 비교할 때만 utc 로 하고 나머지는 걍 hour 로 하믄 됨
    };
    historyAdd = function (date) {
      date.setHours(date.getHours() + 1);
    };
    historyRange = diffHrs;
    resultLabel = function (date) {
      return (date.getHours() + ":00");
    };
  }


  Navtiming.aggregate([
    {
      $match: {
        projectKey: req.params.projectKey,
        uri: req.query.uri,
        created: {
          $gt: new Date(req.query.start),
          $lt: new Date(req.query.end)
        }
      }
    },
    {
      $group: {
        _id: historyGroup,
        prepareAvg: {$avg: { $subtract : ["$domainLookupStart","$navigationStart"]} },
        requestAvg: {$avg: { $subtract : ["$requestStart","$domainLookupStart"]} },
        waitAvg: {$avg: { $subtract : ["$responseStart","$requestStart"]} },
        responseAvg: {$avg: { $subtract : ["$responseEnd","$responseStart"]} },
        pageLoadAvg: {$avg: { $subtract : ["$loadEventEnd","$responseEnd"]} }
      }
    },
    {
      $sort: {_id: 1}
    }
  ], function (err, result) {
    if (err) {
      return next(err);
    }



    var resultWithEmptyDates = [];
    var curDate = new Date(req.query.start);
    var historyData = result.length > 0 ? result.shift() : {};
    for (var inx = 0; inx < historyRange + 1; inx++) {
      var prepareAvg=0,requestAvg=0,waitAvg=0,responseAvg=0,pageLoadAvg = 0;
      if (historyMatch(historyData, curDate)) {
        prepareAvg = historyData.prepareAvg?historyData.prepareAvg:0;
        requestAvg = historyData.requestAvg?historyData.requestAvg:0;
        waitAvg = historyData.waitAvg?historyData.waitAvg:0;
        responseAvg = historyData.responseAvg?historyData.responseAvg:0;
        pageLoadAvg = historyData.pageLoadAvg?historyData.pageLoadAvg:0;

        historyData = result.length > 0 ? result.shift() : {};
      }
      resultWithEmptyDates.push({
        label: new Date(curDate).getTime(),
        prepareAvg: prepareAvg,
        requestAvg: requestAvg,
        waitAvg: waitAvg,
        responseAvg: responseAvg,
        pageLoadAvg:pageLoadAvg
      });
      historyAdd(curDate);
    }
    res.json(resultWithEmptyDates);
  });
};
