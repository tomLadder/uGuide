var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema(
{
  Username:   { type:String, required: true, index: { unique: true } },
  Type:       { type:String, required: true },
  Password:   { type:String, required:true }
});

module.exports = mongoose.model('User', UserSchema);

/*UserSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password'))
      return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash){
          if(err) return next(err);

          user.password = hash;
          next();
      });
  });
});*/
