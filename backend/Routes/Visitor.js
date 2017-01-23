var Visitor           = require('../Models/Visitor');
var Feedback          = require('../Models/Feedback');
var Notification      = require('../Models/Notification');
var Station           = require('../Models/Station');
var Tdot              = require('../Models/Tdot');
var Permission        = require('../Misc/Permission');
var express           = require('express');
var moment            = require('moment');
var router            = express.Router();
var errorManager      = require('../ErrorManager/ErrorManager');
var ErrorType       = require('../ErrorManager/ErrorTypes');
var ObjectId = (require('mongoose').Types.ObjectId);

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;


router.route('/visitor/:_id')
.get(guard.check(Permission.PERMISSION_VISITOR_ID_GET), function(req, res, next) {
  Visitor.findById(req.params._id, function(err, visitor) {
    if(err)
      return next(err);

    if(!visitor) {
      return next(errorManager.generate404NotFound('Visitor with _id ' + req.params.id + ' not found', ErrorType.ERROR_NO_VISITOR_FOUND));
    }

    res.send(visitor);
  })
})
.put(guard.check(Permission.PERMISSION_VISITOR_ID_PUT), function(req, res, next) {
  Visitor.findOneAndUpdate({_id:req.params._id}, req.body, {new: true}, function(err, visitor) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.send(visitor);
    }
  });
})
.delete(guard.check(Permission.PERMISSION_VISITOR_ID_DELETE), function(req, res, next) {
  Visitor.findByIdAndRemove(req.params._id, function(err) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.status(204).send();
    }
  })
});

router.route('/visitor')
.get(guard.check(Permission.PERMISSION_VISITOR_GET), function(req, res, next) {
  Visitor.find({}, function(err, visitors) {
      if (err) {
        return res.send(err);
      }

      res.send(visitors);
  });
})
.post(guard.check(Permission.PERMISSION_VISITOR_POST), function(req, res, next) {
  Tdot.findOne({IsCurrent: true}, function(err, tdot) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    Visitor.findOne({Guide: req.token.sub, IsFinished: false}, function(err, visitor) {
      if(err)
        return next(errorManager.getAppropriateError(err));

      if(!visitor) {
        var visitor = new Visitor(req.body);
        visitor.Guide = req.token.sub;
        visitor.IsFinished = false;
        visitor.Start = undefined;
        visitor.End = undefined;
        visitor.Tdot = tdot._id;

        visitor.save(function(err) {
          if(err)
            return next(errorManager.getAppropriateError(err));

            res.send({_id: visitor._id});
        });
      } else {
        return next(errorManager.generate500InternalServerError('last visitor not finished', ErrotType.ERROR_VISITOR_NOT_FINISHED));
      }
    });
  });
});
