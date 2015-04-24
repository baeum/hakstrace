var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProjectAddressSchema = new Schema({
  _id: {
    type: String  // address
  },
  address: {
    type: String,
    unique: true,
    required: 'Address is required',
    validate: [
      function(key) {
        return true;
      }, 'Address is invalid'
    ]
  },
  alias: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  project: {
    type : String,
    ref: 'Project'
  },
  status:{
    type: String,
    ref: 'ProjectStatus'
  },
  description: {
    type: String
  }
}, { collection: 'projectaddresses' });

mongoose.model('ProjectAddress', ProjectAddressSchema);
