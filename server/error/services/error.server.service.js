var mongoose = require('mongoose');
var HError = mongoose.model('HError');
var HErrorType = mongoose.model('HErrorType');
var HErrorTypeGroup = mongoose.model('HErrorTypeGroup');
var config = require('../../../config/config');

exports.listDailySummaryByBrowser = function (timestamp, projects, callback) {
  var agg = [
    {
      $match: {
        created: {
          $gte: new Date(timestamp),
          $lt: new Date(Date.now() - config.mainDashboardLazy)
        },
        projectKey: {$in: projects}
      }
    },
    {
      $group: {
        _id: {key: "$projectKey", browserName: "$browser.name", browserMajor: "$browser.major"},
        total: {$sum: 1}
      }
    },
    {
      $sort: {
        "_id.key": 1, "total": -1
      }
    }
  ];

  HError.aggregate(agg, function (err, result) {
    if (err) {
      return callback(err)
    }
    //console.log(JSON.stringify(result));
    callback(null, result);
  });
};