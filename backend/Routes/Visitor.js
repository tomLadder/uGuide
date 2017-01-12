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

router.route('/visitor/cancel')
.post(guard.check(Permission.PERMISSION_VISITOR_CANCEL_POST), function(req, res, next) {
  Visitor.findOne({Guide: req.token.sub, IsFinished: false}, function(err, visitor) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!visitor)
      return next(errorManager.generate404NotFound('no visitor found', ErrorType.ERROR_USER_NOT_FOUND));

    if(visitor.IsFinished == true)
      return next(errorManager.generate500InternalServerError("Visitor already finished", ErrorType.ERROR_VISITATION_ALREADY_FINISHED));

    visitor.End = new Date();
    visitor.IsFinished = true;

    visitor.save(function(err) {
      if(err)
        return next(errorManager.getAppropriateError(err));

      res.send({message: 'Visitor cancelled'});
    });
  });
});

router.route('/visitor/done')
.get(guard.check(Permission.PERMISSION_VISITOR_DONE_GET), function(req, res, next) {
Visitor.findOne({Guide: req.token.sub, IsFinished: false}, function(err, visitor) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!visitor)
      return next(errorManager.generate404NotFound('no visitor found', ErrorType.ERROR_NO_VISITOR_FOUND));

    if(visitor.IsFinished == true)
      return next(errorManager.generate500InternalServerError("Visitor already finished", ErrorType.ERROR_VISITATION_ALREADY_FINISHED));

    Tdot.findOne({IsCurrent: true}, function(err, tdot) {
      if(err)
        return next(errorManager.getAppropriateError(err));

      if(!tdot) {
          return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
      }

      Station.find({Tdot: tdot._id},
        function(err, stations) {
          if (err)
            return next(errorManager.getAppropriateError(err));

          Notification.find({Visitor: visitor._id}, function(err, notifications) {
            if (err)
              return next(errorManager.getAppropriateError(err));  

            var notificationIDs = notifications.map(function(s) {return s.Station.toString()});

            var todo = [];

            for(var i=0;i<stations.length;i++) {
              var idx = notificationIDs.indexOf(stations[i]._id.toString());

              if(idx > -1) {
                  if((idx+1) < notifications.length) {
                    var time1 = moment(notifications[idx].Time);
                    var time2 = moment(notifications[idx+1].Time);
                    var diff = moment.duration(time2 - time1).humanize();
                    todo.push({Name: stations[i].Name, Time: diff});
                  } else {
                    todo.push({Name: stations[i].Name, Time: 'Currently visiting!'});
                  }
              }
            }

            res.send(todo); 
          });
        });
    });
  });
});

router.route('/visitor/todo')
.get(guard.check(Permission.PERMISSION_VISITOR_TODO_GET), function (req, res, next) {
Visitor.findOne({Guide: req.token.sub, IsFinished: false}, function(err, visitor) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!visitor)
      return next(errorManager.generate404NotFound('no visitor found', ErrorType.ERROR_NO_VISITOR_FOUND));

    if(visitor.End != undefined)
      return next(errorManager.generate500InternalServerError("Visitor already finished", ErrorType.ERROR_VISITATION_ALREADY_FINISHED));

    Tdot.findOne({IsCurrent: true}, function(err, tdot) {
      if(err)
        return next(errorManager.getAppropriateError(err));

      if(!tdot) {
          return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
      }

      Station.find({Tdot: tdot._id},
        function(err, stations) {
          if (err)
            return next(errorManager.getAppropriateError(err));

            
          Notification.find({Visitor: new ObjectId(visitor._id)}, function(err, notifications) {
            console.log(notifications.length);

            if (err)
              return next(errorManager.getAppropriateError(err));  

            var notificationIDs = notifications.map(function(s) {return s.Station.toString()});

            var todo = [];

            for(var i=0;i<stations.length;i++) {
              var idx = notificationIDs.indexOf(stations[i]._id.toString());

              if(idx == -1) {
                todo.push({id: stations[i]._id, Name: stations[i].Name});
              }
            }

            res.send(todo); 
          });
        });
    });
  });
});

router.route('/visitor/feedback')
.post(guard.check(Permission.PERMISSION_VISITOR_FEEDBACK_POST), function(req, res, next) {
  Visitor.findOne({Guide: req.token.sub, IsFinished: false}, function(err, visitor) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!visitor)
      return next(errorManager.generate404NotFound('no visitor found', ErrorType.ERROR_NO_VISITOR_FOUND));

    if(visitor.IsFinished == true)
      return next(errorManager.generate500InternalServerError("Visitor already finished", ErrorType.ERROR_VISITATION_ALREADY_FINISHED));

    var feedback = new Feedback(req.body);
    feedback.save(function(err, fb) {
      if(err)
        return next(errorManager.getAppropriateError(err));

      visitor.Feedback = fb._id;
      visitor.IsFinished = true;

      visitor.save(function(err) {
        if(err)
          return next(errorManager.getAppropriateError(err));

        res.send({message: 'Feedback successfully added'});
      });
    });
  });
});

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
  Visitor.find(req.query, function(err, visitors) {
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
