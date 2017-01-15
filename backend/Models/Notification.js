var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new mongoose.Schema(
{
  Guide:            { type: Schema.ObjectId, required: true },
  Tdot:             { type: Schema.ObjectId, required: true },
  Station:          { type: Schema.ObjectId, required: true },
  Time:             { type: Date, required: true }
});

module.exports = mongoose.model('Notification', NotificationSchema);
