var User            = require('../Models/User');
var Visitor         = require('../Models/Visitor');
var Permission      = require('../Misc/Permission');
var errorManager    = require('../ErrorManager/ErrorManager');
var express         = require('express');
var router          = express.Router();

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

router.route('/user/tour')
.get(guard.check(Permission.PERMISSION_USER_TOUR_GET), function(req, res, next) {
    Visitor.findOne({Guide: req.token.sub, IsFinished: false}, function(err, visitor) {
      if(err)
        return next(errorManager.getAppropriateError(err));

      if(visitor)
        res.send({Tour: true});
      else
        res.send({Tour: false});
  })
});

router.route('/user/:_id')
.get(guard.check(Permission.PERMISSION_USER_ID_GET), function(req, res, next) {
  User.findById(req.params._id, function(err, user) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('User with _id ' + req.params._id + ' not found'));
    }

    res.send(user);
  })
})
.put(guard.check(Permission.PERMISSION_USER_ID_PUT), function(req, res, next) {
  User.findOneAndUpdate({_id:req.params._id}, req.body, {new: true}, function(err, user) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.send(user);
    }
  });
})
.delete(guard.check(Permission.PERMISSION_USER_ID_DELETE), function(req, res, next) {
  User.findByIdAndRemove(req.params._id, function(err) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.status(204).send();
    }
  })
});

router.route('/user')
.get(guard.check(Permission.PERMISSION_USER_GET), function(req, res, next) {
  User.find(req.query, function(err, users) {
      if (err) {
        return res.send(err);
      }

      res.send(users);
  });
})
.post(guard.check(Permission.PERMISSION_USER_POST), function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err) {
    if(err) {
      return next(errorManager.getAppropriateError(err));
    }

    res.send({message: 'User successfully added'});
  })
});
