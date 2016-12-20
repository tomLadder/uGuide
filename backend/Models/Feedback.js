var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new mongoose.Schema(
{
  FeedbackType:         { type: Number, required: true },
  PredefinedAnswers:    [{ type: Schema.ObjectId, required: false }],
  OptionalAnswer:       { type: String, required: false }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
