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
module.exports = function(db) {
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

	var mongoStore = new MongoStore({
		db: db.connection.db
	});

/*
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
	require('../server/admin/routes/admin-user.server.routes.js')(app);
	require('../server/project/routes/project.server.routes.js')(app);

	app.use(express.static('./public'));

	// error handling 은 app.use 제일 마지막에 해야됨
	app.use(logErrors);
	app.use(clientErrorHandler);
	app.use(errorHandler);

	//require('./socketio')(server, io, mongoStore);
	require('./socketio')(server, io);

	return server;
};

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
};

function clientErrorHandler(err, req, res, next) {
	var errorMessage = 'Unknown server error';
	if(err.message){
		errorMessage = err.message;
	}else if(err.errors){
		for (var errName in err.errors) {
			if (err.errors[errName].message) errorMessage = err.errors[errName].message;
		}
	}

  if (req.xhr) {
    res.status(500).send({ message: errorMessage });
  } else {
    next(err);
  }
};

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
};
