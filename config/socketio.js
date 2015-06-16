var config = require('./config');
var	cookieParser = require('cookie-parser');
var	passport = require('passport');

module.exports = function(server, io, mongoStore) {
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

	io.on('connection', function(socket) {
    console.log('socket connected !!!!');
    socket.join('@error10m');
	});

  var tick = setInterval(function() {
    var now = Date.now();
    var pushData = { x: now,	y: Math.floor(Math.random()*125) };

    io.to('@error10m').emit('news', pushData);
  }, 3000);

};