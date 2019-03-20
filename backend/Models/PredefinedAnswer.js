var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PredefinedAnswerSchema = new mongoose.Schema(
{
  Answer:           { type: String, required: true }
});

module.exports = mongoose.model('PredefinedAnswer', PredefinedAnswerSchema);
