var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProjectStatusSchema = new Schema({
  _id: {
    type: String  // code
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
}, { collection: 'projectstatuses' });

//UserAuthSchema.set('toJSON', { getters: true, virtuals: true });
mongoose.model('ProjectSatus', ProjectStatusSchema);
