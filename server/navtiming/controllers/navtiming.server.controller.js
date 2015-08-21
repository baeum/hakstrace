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
