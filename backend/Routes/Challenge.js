var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var errorManager = require('../ErrorManager/ErrorManager');

var challenges = {};

module.exports = {
  router: router,
  challenges: challenges
};

router.post('/challenge', function(req, res, next) {
  if(req.body.username) {
    challenges[req.body.username] = {challenge: crypto.randomBytes(32).toString('hex'), valid: true};
    res.send(challenges[req.body.username]);
  } else {
    return next(errorManager.generate403Forbidden('No username provided.'));
  }
});
