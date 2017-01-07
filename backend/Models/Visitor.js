var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitorSchema = new mongoose.Schema(
{
  ZipCode:          { type: Number, required: true },
  Gender:           { type: Number, required: true },
  Feedback:         { type: Schema.ObjectId, ref: 'Feedback' },
  Guide:            { type: Schema.ObjectId, required: true, ref: 'User' },
  Start:            { type: Date },
  End:              { type: Date },
  IsFinished:       { type: Boolean },
  Tdot:             { type: Schema.ObjectId, required: true, ref: 'Tdot' }
});

module.exports = mongoose.model('Visitor', VisitorSchema);
