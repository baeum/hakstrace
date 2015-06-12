var config = require('./config'),
	authConfig = require('./authconfig'),
	http = require('http'),
	socketio = require('socket.io'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	//MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport')
	;

//module.exports = function(db) {
module.exports = (function() {
	var app = express();
	var server = http.createServer(app);
	var io = socketio.listen(server);

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(express.static('./public'));

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	app.use(methodOverride());

	/*
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
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(authenticate);

	require('../server/app/routes/app.server.routes.js')(app);
	require('../server/admin/routes/admin.server.routes.js')(app);
	require('../server/admin/routes/admin-user.server.routes.js')(app);
	require('../server/admin/routes/admin-script.server.routes.js')(app);
	require('../server/project/routes/project.server.routes.js')(app);
	require('../server/error/routes/error.server.routes.js')(app);

	// error handling 은 app.use 제일 마지막에 해야됨
	app.use(logErrors);
	app.use(clientErrorHandler);
	app.use(errorHandler);

	//require('./socketio')(server, io, mongoStore);
	require('./socketio')(server, io);

	return server;
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
	var errorMessage = 'Unknown server error';
	if(err.message){
		errorMessage = '[' + err.name + ']' + err.message;
	}
	if(err.errors){
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				errorMessage = errorMessage + '\n\t->' + err.errors[errName].message;
			}
		}
	}

  if (req.xhr) {
    res.status(500).send({ message: errorMessage });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}


function authenticate(req, res, next) {
	var requestPath = req.path;

	//check exclude uri
	var isExcludeUri =  (authConfig.excludeAuthenticaitonUriMap.has(requestPath));

	//exclude uri pattern
	for(var excludeUriPart in authConfig.excludeAuthenticationUriPatterns) {
		if(requestPath.indexOf(excludeUriPart) > -1) {
			isExcludeUri = true; break;
		}
	}

	if(isExcludeUri) {
		next();
	} else {
		if(req.isAuthenticated()){
			next();
		}else{
			res.status(403).send({ message: 'Need Login' });
		}
	}
}
