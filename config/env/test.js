module.exports = {
	db: 'mongodb://localhost/mean-book-test',
	sessionSecret: 'Your Application Session Secret',

	viewEngine: 'ejs',
	
	facebook: {
		clientID: 'APP_ID',
		clientSecret: 'APP_SECRET',
		callbackURL: 'http://localhost:3000/oauth/facebook/callback'
	},

	twitter: {
		clientID: 'APP_ID',
		clientSecret: 'APP_SECRET',
		callbackURL: 'http://localhost:3000/oauth/twitter/callback'
	},

	google: {
		clientID: 'APP_ID',
		clientSecret: 'APP_SECRET',
		callbackURL: 'http://localhost:3000/oauth/google/callback'
	}
};