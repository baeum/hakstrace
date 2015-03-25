var config = require('./config'),
	http = require('http'),
	socketio = require('socket.io'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport');

//module.exports = function(db) {
module.exports = function() {
	var app = express();
	var server = http.createServer(app);
	var io = socketio.listen(server);

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	app.use(methodOverride());

	/*
	// mongo db 일단 주석처리
	var mongoStore = new MongoStore({
		db: db.connection.db
	});

	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: mongoStore  // socket.io 와 express 의 세션이 공유되지 않아 몽고db 를 sessionstore 로 사용한다.
	}));
	*/

	app.set('views', './server');
	app.set('view engine', 'ejs');

	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	require('../server/app/routes/app.server.routes.js')(app);
	require('../server/admin/routes/admin.server.routes.js')(app);

	app.use(express.static('./public'));

	//require('./socketio')(server, io, mongoStore);
	require('./socketio')(server, io);

	return server;
};
