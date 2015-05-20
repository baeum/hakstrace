var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var HErrorSchema = new Schema({
  projectKey: {
    type: String,
    required:true
  },
  errorTypeRep: {
    type: Schema.Types.ObjectId,
    ref: 'HErrorType'
  },
  errorType: {
    type: Schema.Types.ObjectId,
    ref: 'HErrorType'
  },
  language:{
    type: String
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
  browser:{
    name: {type: String}, major: {type: String}, version: {type: String}
  },
  device:{
    model: {type: String}, type: {type: String}, vendor: {type: String}
  },
  os: {
    name: {type: String}, version: {type: String}
  },
  created: {
    type: Date,
    default: Date.now,
    get: function(date) {
        //return moment(date).format('YYYY-MM-DD hh:mm:ss');
        return new Date(date).toTimeString();
    }
  }
}, { collection: 'errors' });

mongoose.model('HError', HErrorSchema);
