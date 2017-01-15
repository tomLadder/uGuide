var express             = require('express');
var sha256              = require('sha256');
var crypto              = require('crypto');
var jwt                 = require('njwt');
var router              = express.Router();
var crypto              = require('crypto');
var key                 = crypto.randomBytes(64).toString('hex');
var mongoose            = require('mongoose');
var UserType                = require('../Models/UserType');
var User                = require('../Models/User');
var Tdot                = require('../Models/Tdot');
var Challenge           = require('../Routes/Challenge');
var errorManager        = require('../ErrorManager/ErrorManager');
var PermissionHelper    = require('../Misc/PermissionHelper');
var ErrorType           = require('../ErrorManager/ErrorTypes');

module.exports = router;

router.post('/auth', function(req, res, next) {
  if(!(req.body.username in Challenge.challenges) || (!Challenge.challenges[req.body.username].valid)) {
    return next(errorManager.generate401Unauthorized('Request a challenge first.', ErrorType.ERROR_REQUEST_CHALLENGE_FIRST));
  }

  User.findOne({
    Username: req.body.username
  }, function(err, user) {
    if(err)
      throw err;

    if(!user || sha256(user.Password + Challenge.challenges[req.body.username].challenge) != req.body.password) {
      return next(errorManager.generate401Unauthorized('Authentication failed. User not found.', ErrorType.ERROR_AUTH_FAILED_USER_NOT_FOUND));
    } else {
      //Tdot lock - hacky method - please change
      Tdot.findOne({IsCurrent: true, IsLocked: true}, function(err, tdot) {
        if(tdot != undefined && user.Type == UserType.STATION) {
          return next(errorManager.generate401Unauthorized('System is in LOCK-MODE', ErrorType.ERROR_SYSTEM_LOCK_MODE));
        }

        var claims = {
          sub: user._id,
          iss: 'localhost',
        }

        Challenge.challenges[req.body.username].valid = false;

        var token = jwt.create(claims,key).compact();
        res.send({token: token, user: { _id: user._id, username: user.Username, type: user.Type } });
      });
    }
  });
});

router.use(function(req, res, next) {
  if(req.headers['backdoor'] == 'admin') {
    req.token = { type: UserType.ADMIN, permissions: PermissionHelper.getPermissions(UserType.ADMIN), sub: mongoose.Types.ObjectId('000000000000000000000000') }; //Admin
    //else if(req.headers['backdoorType'] == 'guide')
      //req.token = { type: UserType.GUIDE, permissions: PermissionHelper.getPermissions(UserType.GUIDE), sub: mongoose.Types.ObjectId('000000000000000000000002') }; //Guide
    //req.token = { type: UserType.STATION, permissions: PermissionHelper.getPermissions(UserType.STATION), sub: mongoose.Types.ObjectId('000000000000000000000001') }; //Station
    //req.token = { type: UserType.STATION, permissions: PermissionHelper.getPermissions(UserType.STATION), sub: mongoose.Types.ObjectId('000000000000000000000003') }; //Station2
    next();
  } else if(req.headers['backdoor'] == 'guide') {
    req.token = { type: UserType.GUIDE, permissions: PermissionHelper.getPermissions(UserType.GUIDE), sub: mongoose.Types.ObjectId('000000000000000000000002') }; 
    next();
  } else {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
      jwt.verify(token, key, function(err, token) {
          if(err) {
            return next(errorManager.generate401Unauthorized('Authentication failed. Token wrong.', ErrorType.ERROR_AUTH_FAILED_TOKEN_WRONG));
          } else {
            User.findOne({_id: token.body.sub}, function(err, user) {
              if(err)
                return next(errorManager.getAppropriateError(err));

              if(!user)
                return next(errorManager.generate401Unauthorized('User not found!', ErrorType.ERROR_AUTH_FAILED_USER_NOT_FOUND));

              req.token = token.body;
              req.token.type = user.Type;
              req.token.permissions = PermissionHelper.getPermissions(user.Type);
              next();
            });
          }
      });
    } else {
      return next(errorManager.generate403Forbidden('No token provided.', ErrorType.ERROR_NO_TOKEN_PROVIDEN));
    }
  }
});
