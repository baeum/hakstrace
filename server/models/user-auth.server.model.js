var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserAuthSchema = new Schema({
  code: {
    type: String,
    unique: true
  },
  name: {
    type: String,
  },
  value: {
    type: String
  }
});

mongoose.model('UserAuth', UserAuthSchema);
