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
    type: Number
  },
  domainLookupStart:{
    type: Number
  },
  connectStart:{
    type: Number
  },
  requestStart:{
    type: Number
  },
  responseStart:{
    type: Number
  },
  responseEnd:{
    type: Number
  },
  domLoading:{
    type: Number
  },
  loadEventStart:{
    type: Number
  },
  loadEventEnd:{
    type: Number
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
