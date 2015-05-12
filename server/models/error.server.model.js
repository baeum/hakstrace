var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var HErrorSchema = new Schema({
  projectKey: {
    type: String,
    required:true
  },
  message:{
    type: String,
    required:true
  },
  fileName:{
    type: String,
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
    default:''
  },
  userAgent:{
    type: String
  },
  host:{
    type: String
  },
  referer:{
    type: String
  },
  clientIp:{
    type: String
  },
  created: {
    type: Date,
    default: Date.now,
    get: function(date) {
        return moment(date).format('YYYY-MM-DD hh:mm:ss');
    }
  }
}, { collection: 'errors' });

mongoose.model('HError', HErrorSchema);
