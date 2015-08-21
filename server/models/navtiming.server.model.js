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
  uri:{
    type: String
  },
  url:{
    type: String
  },
  navigationStart:{
    type: String
  },
  domainLookupStart:{
    type: String
  },
  connectStart:{
    type: String
  },
  requestStart:{
    type: String
  },
  responseStart:{
    type: String
  },
  responseEnd:{
    type: String
  },
  domLoading:{
    type: String
  },
  loadEventStart:{
    type: String
  },
  loadEventEnd:{
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
        return new Date(date).toTimeString();
    }
  }
}, { collection: 'navtimings' });

NavtimingSchema.set('autoIndex', false);
NavtimingSchema.index({created: -1, projectKey: 1});
NavtimingSchema.index({projectKey: 1, created: -1});

mongoose.model('Navtiming', NavtimingSchema);
