var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitorSchema = new mongoose.Schema(
{
  ZipCode:          { type: Number, required: true },
  Gender:           { type: Number, required: true },
  Feedback:         { type: Schema.ObjectId },
  Guide:            { type: Schema.ObjectId, required: true },
  Start:            { type: Date },
  End:              { type: Date },
  IsFinished:       { type: Boolean },
  Tdot:             { type: Schema.ObjectId, required: true }
});

module.exports = mongoose.model('Visitor', VisitorSchema);
