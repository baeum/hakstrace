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
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport')
	;

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
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(fAuthentication);

	require('../server/app/routes/app.server.routes.js')(app);
	require('../server/admin/routes/admin.server.routes.js')(app);
	require('../server/admin/routes/admin-user.server.routes.js')(app);
	require('../server/admin/routes/admin-script.server.routes.js')(app);
	require('../server/project/routes/project.server.routes.js')(app);
	require('../server/error/routes/error.server.routes.js')(app);

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
};

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
};


var fAuthentication = function (req, res, next) {
	var requestPath = req.path;
	var isExcludeOrAuth = false;
	//skip authentication on exclude paths
	if(authConfig.excludeAuthenticaitonUriMap.has(requestPath)) {
		//console.log("IsExclude:" + requestPath);
		isExcludeOrAuth = true;
	} else {
		for(var excludeUriPart in authConfig.excludeAuthenticationUriPatterns) {
			if(requestPath.indexOf(excludeUriPart) > -1) {
				isExcludeOrAuth = true;
			}
		}

		//do authentication (.html and all /api/)
		if(!isExcludeOrAuth &&
			(req.url.indexOf('.html') > -1 || req.url.indexOf('/api/') > -1)) {
			if(req.isAuthenticated()){
				isExcludeOrAuth = true;
			}else{
				res.status(403).send({ message: 'Need Login' });
			}
		} else {
			isExcludeOrAuth = true;
		}
	}

	if(isExcludeOrAuth) {
		next();
	}

	/*
	 if (req.isAuthenticated()){
	 console.log("req is authenticated : " + req.url);
	 }else{
	 console.log("req is NOT NOT NOT authenticated: " + req.url);
	 }*/
}
