var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HErrorTypeSchema = new Schema({
  projectKey: {
    type: String,
    required:true
  },
  projectRoot:{
    type: String
  },
  context: {
    type: String
  },
  type:{
    type: String,
    trim: true,
    default:''
  },
  message:{
    type: String,
    trim: true,
    required:true
  },
  fileName:{
    type: String,
    trim: true,
    required:true
  },
  lineNo:{
    type: Number,
    default:-1
  },
  colNo:{
    type: Number,
    default:-1
  },
  stack:{
    type: String,
    trim: true,
    default:''
  },
  firstSeen: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, { collection: 'errortypes' });


mongoose.model('HErrorType', HErrorTypeSchema);
