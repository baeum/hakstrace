var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HErrorTypeGroupSchema = new Schema({
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
  created: {
    type: Date,
    default: Date.now
  }
}, { collection: 'errortypegroups' });

mongoose.model('HErrorTypeGroup', HErrorTypeGroupSchema);
