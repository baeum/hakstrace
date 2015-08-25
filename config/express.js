var config = require('./config');
var authConfig = require('./authconfig');
var http = require('http');
var socketio = require('socket.io');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var passport = require('passport');

//module.exports = function(db) {
module.exports = (function (db) {
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

  app.set('views', './server');
  app.set('view engine', 'ejs');

  app.use(flash());

  //TODO : add socketio seesion validation logic
  var sessionStore = new MongoStore({
    db: db.connection.db
  });

  var sessionMiddleware = session({
    saveUninitialized: true,
    resave: false,
    secret: config.sessionSecret
    //,
    //store: sessionStore
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(authenticate);

  require('../server/app/routes/app.server.routes.js')(app);
  require('../server/admin/routes/admin.server.routes.js')(app);
  require('../server/admin/routes/admin-user.server.routes.js')(app);
  require('../server/admin/routes/admin-script.server.routes.js')(app);
  require('../server/project/routes/project.server.routes.js')(app);
  require('../server/error/routes/error.server.routes.js')(app);
  require('../server/navtiming/routes/navtiming.server.routes.js')(app);

  // error handling 은 app.use 제일 마지막에 해야됨
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
  //require('./socketio')(server, io, mongoStore);

  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  });
  require('./socketio')(server, io);

  return server;
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  var errorMessage = 'Unknown server error';
  if (err.message) {
    errorMessage = '[' + err.name + ']' + err.message;
  }
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        errorMessage = errorMessage + '\n\t->' + err.errors[errName].message;
      }
    }
  }

  if (req.xhr) {
    res.status(500).send({message: errorMessage});
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', {error: err});
}

function authenticate(req, res, next) {

  var requestPath = req.path;

  var isExcludeUri = (authConfig.excludeAuthenticaitonUriMap.has(requestPath));

  //exclude uri pattern
  for (var i=0; i < authConfig.excludeAuthenticationUriPatterns.length; i++) {
    if (requestPath.indexOf(authConfig.excludeAuthenticationUriPatterns[i]) > -1) {
      isExcludeUri = true;
      break;
    }
  }

  if (isExcludeUri) {
    next();
  } else {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send({message: 'Need Login'});
    }
  }
}
