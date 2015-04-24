var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  _id: {
    type: String  // key
  },
  key: {
    type: String,
    unique: true,
    required: 'Project Key is required',
    validate: [
      function(key) {
        return key && key.length > 6;
      }, 'Project Key should be longer'
    ]
  },
  apikey: {
    type: String
  },
  name: {
    type: String,
    required: 'Name is required'
  },
  created: {
    type: Date,
    default: Date.now
  },
  addresses: [{
    type : String, ref: 'ProjectAddress'
  }],
  description: {
    type: String
  }
}, { collection: 'projects' });

mongoose.model('Project', ProjectSchema);
