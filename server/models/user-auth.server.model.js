var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserAuthSchema = new Schema({
  _id: {
    type: String
  },
  code: {
    type: String,
    unique: true
  },
  name: {
    type: String,
  },
  order: {
    type: Number
  }
}, { collection: 'userauths' });

//UserAuthSchema.set('toJSON', { getters: true, virtuals: true });
mongoose.model('UserAuth', UserAuthSchema);
