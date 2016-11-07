var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StationSchema = new mongoose.Schema(
{
  Name:             { type: String, required: true, index: { unique: true } },
  Grade:            { type: Number, required: true },
  Subject:          { type: String, required: true },
  Description:      { type: String, required: true },
  User:             { type: Schema.ObjectId, required: false },
  Tdot:             { type: Schema.ObjectId, required: false },
});

module.exports = mongoose.model('Station', StationSchema);
