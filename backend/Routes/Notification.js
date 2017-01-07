var Notification    = require('../Models/Notification');
var Visitor         = require('../Models/Visitor');
var UserType        = require('../Models/UserType');
var TimeConstants   = require('../Models/TimeConstant');
var Station         = require('../Models/Station');
var Permission      = require('../Misc/Permission');
var express         = require('express');
var router          = express.Router();
var errorManager    = require('../ErrorManager/ErrorManager');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

router.route('/notification/:_idstation')
.post(guard.check(Permission.PERMISSION_NOTIFICATION_IDSTATION_POST), function(req, res, next) {
  Visitor.findOne({Guide: req.token.sub, IsFinished: false}, function(err, visitor) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!visitor)
      return next(errorManager.generate404NotFound('no visitor found'));

    if(req.params._idstation == TimeConstants.START) {
      if(visitor.End != undefined)
        return next(errorManager.generate500InternalServerError("Visitor already finished"));

      if(visitor.Start == undefined) {
        visitor.Start = new Date();

        visitor.save(function(err){
          if(err)
              return next(errorManager.getAppropriateError(err));
          
          res.send();
        });
      } else {
        return next(errorManager.generate500InternalServerError("Startpoint already set"));
      }
    } else if (req.params._idstation == TimeConstants.END) {
      if(visitor.End == undefined) {
        visitor.End = new Date();

        if(visitor.Start == undefined) {
          visitor.Start = new Date();
        }

        visitor.save(function(err){
          if(err)
              return next(errorManager.getAppropriateError(err));
          
          res.send();
        });
      } else {
        return next(errorManager.generate500InternalServerError("Endpoint already set"));
      }
    } else {
      if(visitor.Start == undefined && visitor.End == undefined)
        return next(errorManager.generate500InternalServerError("No Startpoint set"));

      if(visitor.End != undefined)
        return next(errorManager.generate500InternalServerError("Visitor already finished"));

      Notification.findOne({ Station: req.params._idstation, Visitor: visitor._id }, function(err, notf) {
        if(err)
          return next(errorManager.getAppropriateError(err));

        if(!notf) {
          var notification = new Notification({Visitor: visitor._id, Station: req.params._idstation, Time: new Date()});
          notification.save(function(err, next) {
            if(err)
              return next(errorManager.getAppropriateError(err));

            res.send({message: 'notification successfully added'});
          });   
        } else {
          res.send('ok');
        }  
      });
    }
  });
});

router.route('/notification')
.get(guard.check(Permission.PERMISSION_NOTIFICATION_GET), function(req, res, next) {
  Notification.find(req.query, function(err, notifications) {
    if(err)
      return next(errorManager.getAppropriateError(err)); 

      res.send(notifications);
  });
});