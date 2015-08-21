var mongoose = require('mongoose');
var UAParser = require('ua-parser-js');

exports.createTiming = function (req, res, next) {

  // @TO-DO
  // projectKey 랑 apiKey 로 유효성 검즈하는 로직 필요
  var navTiming = {};
  navTiming.projectKey = req.params.projectKey;
  navTiming.userAgent = req.query.userAgent;
  navTiming.host = req.headers.host;
  navTiming.referer = req.headers.referer;
  navTiming.clientIp = req.ip;

  console.log('##### navTiming.userAgetn=' + navTiming.userAgent);
  //host: location.protocol + "//" + location.host,
  //  uri: location.pathname,
  //  url: window.location.href,
  //  userAgent: navigator.userAgent,
  //  navigationStart: t.navigationStart,
  //  domainLookupStart: t.domainLookupStart,
  //  connectStart: t.connectStart,
  //  requestStart: t.requestStart,
  //  responseStart: t.responseStart,
  //  responseEnd: t.responseEnd,
  //  domLoading: t.domLoading,
  //  loadEventStart: t.loadEventStart,
  //  loadEventEnd: t.loadEventEnd

  //https://github.com/faisalman/ua-parser-js
  //var uaparser = new UAParser();
  //var uaResult = uaparser.setUA(herror.userAgent).getResult();
  //herror.browser = uaResult.browser;
  //herror.device = uaResult.device;
  //herror.os = uaResult.os;

};
