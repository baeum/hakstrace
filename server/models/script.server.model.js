var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var ScriptSchema = new Schema({
  script: {
    type: String,
    required: 'script is required'
  },
  created: {
    type: Date,
    default: Date.now,
    get: function(date) {
        return moment(date).format('YYYY-MM-DD hh:mm');
    }
  },
  version:{
    type: Number
  }
}, { collection: 'scripts' });


ScriptSchema.statics.findLatest = function (callback) {
  this.find()
    .sort({'version': -1})
    .limit(1)
    .exec(callback);
}


mongoose.model('Script', ScriptSchema);
ScriptSchema.plugin(autoIncrement.plugin, { model: 'Script', field: 'version' });
