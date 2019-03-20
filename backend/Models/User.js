var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema(
{
  Username:   { type:String, required: true, index: { unique: true } },
  Type:       { type:Number, required: true },
  Password:   { type:String, required:true }
});

module.exports = mongoose.model('User', UserSchema);
