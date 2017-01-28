var mongoose = require('mongoose');

var TdotSchema = new mongoose.Schema(
{
  Year:       { type: Number, required: true, index: { unique: true } },
  IsCurrent:  { type: Boolean, required: true },
  IsLocked:   { type: Boolean, required: true },
  Map:        { type: String, required: false },
  Points:     [
                {
                  Tag:String, X:Number, Y:Number
                }
              ]
});

module.exports = mongoose.model('Tdot', TdotSchema);