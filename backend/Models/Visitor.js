var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitorSchema = new mongoose.Schema(
{
  ZipCode:          { type: Number, required: true },
  Gender:           { type: Number, required: true },
  Feedback:         {
                      FeedbackType:         { type: Number, required: true },
                      PredefinedAnswers:    [{ type: Schema.ObjectId, required: false, ref: 'Feedback' }],
                      OptionalAnswer:       { type: String, required: false }
                    },
  Guide:            { type: Schema.ObjectId, required: true, ref: 'User' },
  Tdot:             { type: Schema.ObjectId, required: true, ref: 'Tdot' },
  Notifications:    [
                      {
                        Time:   { type: Number, required: true },
                        Id:     { type: Schema.ObjectId, required: true, ref: 'Station' }
                      }
                    ],
   Start:            { type: Number, required: true },
   End:              { type: Number, required: true }
});

module.exports = mongoose.model('Visitor', VisitorSchema);
