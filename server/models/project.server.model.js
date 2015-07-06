var mongoose = require('mongoose');
var hat = require('hat');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  _id: {
    type: String  // key
  },
  projectKey: {
    type: String,
    unique: true,
    required: 'Project Key is required',
    validate: [
      function(key) {
        return key && key.length > 6;
      }, 'Project Key should be longer than 6.'
    ]
  },
  host :{
    type: String  // 이거 script 에서 호출한 hakstrace domain
  },
  apiKey: {
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
  address: {
    type : String
  },
  description: {
    type: String
  },
  active:{
    type: Boolean
  },
  owner: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { collection: 'projects' });


ProjectSchema.statics.generateApiKey = function() {
  var rack = hat.rack();
  return rack();
};


mongoose.model('Project', ProjectSchema);
