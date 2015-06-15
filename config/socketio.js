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
    socket.emit('news', {hello: 'world'});
    socket.on('other data', function(data) {
      console.log('socket-io-on : %s', data);
    });
	});
	//io.on('connection', function(socket) {
	//	require('../app/controllers/chat.server.controller')(io, socket);
	//});
};