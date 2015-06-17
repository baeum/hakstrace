var config = require('./config');
var cookieParser = require('cookie-parser');
var passport = require('passport');

var mongoose = require('mongoose');
var HError = mongoose.model('HError');


module.exports = function (server, io, mongoStore) {
  //io.use(function(socket, next) {
  //	cookieParser(config.sessionSecret)(socket.request, {}, function(err) {
  //		var sessionId = socket.request.signedCookies['connect.sid'];
  //		mongoStore.get(sessionId, function(err, session) {
  //			socket.request.session = session;
  //			passport.initialize()(socket.request, {}, function() {
  //				passport.session()(socket.request, {}, function() {
  //					if (socket.request.user) {
  //						next(null, true);
  //					} else {
  //           console.log('##socket-User is not authenticated');
  //						next(new Error('User is not authenticated'), false);
  //					}
  //				});
  //			});
  //		});
  //	});
  //});

  io.on('connection', function (socket) {
    console.log('socket connected !!!!');
    socket.join('@error10m');
  });

  var tick = setInterval(function () {

    aggrErrorsRealtime('YosiJoA', config.mainDashboardInterval, config.mainDashboardLazy,
      function (err, result) {
        var time = Date.now() - config.mainDashboardLazy;
        var total = result[0] ? result[0].total : 0;
        var pushData = {x: time, y: total};
        io.to('@error10m').emit('allErrorCount', pushData);
      });
  }, config.mainDashboardInterval);

};

function aggrErrorsRealtime(projectKey, interval, lazy, next) {

  var agg = [
    {
      $match: {
        projectKey: projectKey,
        created: {$gte: new Date(Date.now() - interval - lazy), $lt: new Date(Date.now() - lazy)}
      }
    },
    {
      $group: {
        _id: "$projectKey",
        total: {$sum: 1}
      }
    }
  ];

  HError.aggregate(agg, function (err, result) {
    if (err) {
      console.error('error on aggr errors!!!')
    }
    //console.log(JSON.stringify(result));
    next(err, result);
  });
};