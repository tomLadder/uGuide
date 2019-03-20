var mongoose = require('mongoose');

var TdotSchema = new mongoose.Schema(
{
  Year:       { type: Number, required: true, index: { unique: true } },
  IsCurrent:  { type: Boolean, required: false },
  IsLocked:   { type: Boolean, required: false },
  Map:        { type: String, required: false },
  Points:     [
                {
                  Tag:String, X:Number, Y:Number
                }
              ]
});

module.exports = mongoose.model('Tdot', TdotSchema);