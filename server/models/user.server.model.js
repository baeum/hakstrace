var mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

// mongoose validator 좋네. custom 도 가능함.
var UserSchema = new Schema({
  _id: {
    type: String
  },
  name: {
    type: String,
    required: 'Username is required',
    trim: true
  },
  email: {
    type: String,
    // Validate the email format
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    unique: true,
    required: 'Email is required',
    trim: true
  },
  password: {
    type: String,
    required: 'Password is required',
    // Validate the 'password' value length
    validate: [
      function(password) {
        return password && password.length > 6;
      }, 'Password should be longer'
    ]
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    // Validate 'provider' value existance
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  created: {
    type: Date,
    // Create a default 'created' value
    default: Date.now
  },
  auth: {
		type: String,
		ref: 'UserAuth'
	},
  projects: [{type: String, ref: 'Project' }]
}, { collection: 'users' });


// Set the 'fullname' virtual property
/*
UserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
  var splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});
*/

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    console.log('password not modified');
    return next();
  }

  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  if(!this._id){
    this._id = this.email;
  }
  next();
});

// schema 에서 pre, post 를 걸 수 있네. 괜춘네
UserSchema.post('save', function(next) {
  if(this.isNew) {
    console.log('A new user was created.');
  } else {
    console.log('A user updated its details.');
  }
});



UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};


// schema 에서 static, instace 메써드도 추가할 수 있음.
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');
  _this.findOne({
      username: possibleUsername
    }, function(err, user) {
      if (!err) {
        if (!user) {
          callback(possibleUsername);
        } else {
          return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }
      } else {
        callback(null);
    }
  });
};

UserSchema.statics.findOneByUsername = function (username,callback) {
  this.findOne({ username: new RegExp(username, 'i') }, callback);
};


//UserSchema.set('toJSON', { getters: true, virtuals: true });

mongoose.model('User', UserSchema);
