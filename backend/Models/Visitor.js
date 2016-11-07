var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitorSchema = new mongoose.Schema(
{
  ZipCode:          { type: Number, required: true },
  Gender:           { type: Boolean, required: true },
  Feedback:         { type: String },
  VisitFinished:    { type: Boolean },
  Guide:            { type: Schema.ObjectId, required: true}
});

module.exports = mongoose.model('Visitor', VisitorSchema);
