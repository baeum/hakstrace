module.exports = {
	// Development configuration options
	//db: 'mongodb://ex-std-node488.prod.rhcloud.com/nodejs',
	db: process.env.HAKSTRACE_DB_URL || 'mongodb://localhost/hakstrace',
	dbuser: process.env.HAKSTRACE_DB_USER || '',
	dbpass: process.env.HAKSTRACE_DB_PASS || '',
	mongoDebug: 'default',
	sessionSecret: 'developmentSessionSecret',

	mainDashboardInterval: 3000,
	mainDashboardLazy: 10000
};
