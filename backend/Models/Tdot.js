var mongoose = require('mongoose');

var TdotSchema = new mongoose.Schema(
{
  year:     { type: Number, required: true, index: { unique: true } }
});

module.exports = mongoose.model('Tdot', TdotSchema);
