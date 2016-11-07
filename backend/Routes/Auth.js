var express = require('express');
var sha256 = require('sha256');
var User = require('../Models/User');
var Challenge = require('../Routes/Challenge');
var errorManager = require('../ErrorManager/ErrorManager');
var crypto = require('crypto');
var jwt    = require('njwt');
var router = express.Router();
var crypto = require('crypto');
var key = crypto.randomBytes(64).toString('hex');

module.exports = router;

router.post('/auth', function(req, res, next) {
  if(!(req.body.username in Challenge.challenges) || (!Challenge.challenges[req.body.username].valid)) {
    return next(errorManager.generate401Unauthorized('Request a challenge first.'));
  }

  User.findOne({
    Username: req.body.username
  }, function(err, user) {
    if(err)
      throw err;

    if(!user || sha256(user.Password + Challenge.challenges[req.body.username].challenge) != req.body.password) {
      return next(errorManager.generate401Unauthorized('Authentication failed. User not found.'));
    } else {
      var claims = {
          sub: user._id,
          iss: 'localhost',
          permission: user.Type
        }

        Challenge.challenges[req.body.username].valid = false;

        var token = jwt.create(claims,key).compact();
        res.send({token: token, user: { _id: user._id, username: user.Username, type: user.Type } });
    }
  });
});

router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, key, function(err, token) {
        if(err) {
          return next(errorManager.generate401Unauthorized('Authentication failed. Token wrong.'));
        } else {
          //req.identity = {"permissions": token.body.permissions };
          req.token = token.body;
          next();
        }
    });
  } else {
    return next(errorManager.generate403Forbidden('No token provided.'));
  }
});
