var config = require('./config');
var cookieParser = require('cookie-parser');
var passport = require('passport');

var mongoose = require('mongoose');
var HError = mongoose.model('HError');
var Project = mongoose.model('Project');

var HashMap = require('hashmap');
var userService = require('../server/admin/services/admin-user.server.service');

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
  io.use(function (socket, next) {
    console.log('[SCK]io.use-test');
    next();
  });

  var connCount = 0;
  io.on('connection', function (socket) {
    connCount++;
    var userId;
    if (socket.request.session.passport) {
      userId = socket.request.session.passport['user'];
    }
    console.log('[SCK]connected %d - user:%s socket:%s', connCount, userId, socket.id);
    socket.emit('interval', {interval: config.mainDashboardInterval/1000});

    if (userId) {
      userService.listUserProject(userId, function(err, projects){
        if(err) {
          console.log('[DB][ERR]on listUserProject');
          return;
        }
        var arrLen = projects.length;
        for (var i = 0; i < arrLen; i++) {
          var room = '@' + projects[i];
          socket.join(room);
          console.log('[SCK]%s join to %s', userId, room);
        }
      });
    }

    socket.on('disconnect', function () {
      connCount--;
      console.log('[SCK]disconnect - user:%s socket:%s', userId, socket.id);
    });

    //just for message testing
    socket.on('signin', function () {
      console.log('[SCK]signin - user:%s socket:%s', userId, socket.id);
    });
  });

  var tick = setInterval(function () {
    if (connCount == 0) return; // do not get data when nobody connect
    else if (connCount < 0) {
      console.error('[ERR][TIMER]negative number of connection !!! why ???');
      return;
    }

    var time = Date.now() - config.mainDashboardLazy;
    aggrErrorsRealtime(config.mainDashboardInterval, config.mainDashboardLazy,
      function (err, result) {
        if (err) {
          console.error('[ERR]on aggr realtime');
          return;
        }

        var resultMap = new HashMap();
        for (var i = 0; i < result.length; i++) {
          resultMap.set(result[i]._id, result[i]);
        }

        Project.find({active: true}).select('_id').exec(function (err, projects) {
          if (err) {
            return;
          } else if (!projects || projects.length == 0) {
            return;
          }
          var len = projects.length;
          for (var i = 0; i < len; i++) {
            var resultInId = resultMap.get(projects[i]._id);
            var total = resultInId ? resultInId.total : 0;
            var pushData = {project: projects[i]._id, x: time, y: total};

            console.log('[SCK]#to=@%s#pushData=%s', projects[i]._id, JSON.stringify(pushData));
            io.sockets.in('@' + projects[i]._id).emit('allErrorCount', pushData);
          }
        });
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