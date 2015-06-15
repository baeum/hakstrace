process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var httpPort = process.env.HAKSTRACE_WEB_PORT || 3000;

var db = require('./config/mongoose')();

var app = require('./config/express')(db);

require('./config/passport')();

app.listen(httpPort);

console.log('Server running at http://localhost:%d/', httpPort);
