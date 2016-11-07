var User = require('../Models/User');
var errorManager = require('../ErrorManager/ErrorManager');
var express = require('express');
var router = express.Router();

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permission'
});

module.exports = router;

router.route('/user/:_id')
.get(guard.check('admin'), function(req, res, next) {
  User.findById(req.params._id, function(err, user) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('User with _id ' + req.params._id + ' not found'));
    }

    res.send(user);
  })
})
.put(guard.check('admin'), function(req, res, next) {
  User.findOneAndUpdate({_id:req.params._id}, req.body, {new: true}, function(err, user) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.send(user);
    }
  });
})
.delete(guard.check('admin'), function(req, res, next) {
  User.findByIdAndRemove(req.params._id, function(err) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.status(204).send();
    }
  })
});

router.route('/user').get(guard.check('admin'), function(req, res, next) {
  User.find(req.query, function(err, tdots) {
      if (err) {
        return res.send(err);
      }

      res.send(tdots);
  });
})
.post(guard.check('admin'), function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err) {
    if(err) {
      return next(errorManager.getAppropriateError(err));
    }

    res.send({message: 'User successfully added'});
  })
});
