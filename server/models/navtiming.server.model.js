var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var NavtimingSchema = new Schema({
  projectKey: {
    type: String,
    required:true
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

HErrorSchema.set('autoIndex', false);
HErrorSchema.index({created: -1, projectKey: 1});
HErrorSchema.index({projectKey: 1, created: -1});


mongoose.model('HError', HErrorSchema);
