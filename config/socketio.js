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

  //why is Socket#use invoked only for onconnection?? not for client's emit ?? why???
  io.use(function(socket, next) {
    console.log('[SCK]io.use-test');
    next();
  });

  //TODO : push errors only of owned projects. (plan to use a socket-io room.)
  //currently push all projects errors
  //first of all, it should change mongodb collection schemes.
  //( which projects, who owns? )
  var connCount = 0;
  io.on('connection', function (socket) {
    connCount++;
    var userId;
    if(socket.request.session.passport) {
      userId = socket.request.session.passport['user'];
    }
    console.log('[SCK]connected %d - user:%s socket:%s', connCount, userId, socket.id);
    if(userId) {
      socket.join('@' + userId);
      console.log('[SCK]join to @%s', userId);
    }

    socket.on('disconnect', function() {
      connCount--;
      console.log('[SCK]disconnect - user:%s socket:%s', userId, socket.id);
    });

    //just for message testing
    socket.on('signin', function() {
      console.log('[SCK]signin - user:%s socket:%s', userId, socket.id);
    });
  });

  var tick = setInterval(function () {
    if(connCount == 0) return; // do not get data when nobody connect
    else if(connCount < 0) {
      console.error('[ERR][TIMER]minus connection !!! why ???');
      return;
    }

    aggrErrorsRealtime(config.mainDashboardInterval, config.mainDashboardLazy,
      function (err, result) {
        var time = Date.now() - config.mainDashboardLazy;
        var total = result[0] ? result[0].total : 0;
        var pushData = {x: time, y: total};
        //console.log('[SCK]#pushData=%s', JSON.stringify(pushData));
        io.emit('allErrorCount', pushData); //TODO push to project owner's specific room only
      });
  }, config.mainDashboardInterval);
};

function aggrErrorsRealtime(interval, lazy, next) {

  var agg = [
    {
      $match: {
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
}