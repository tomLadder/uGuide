var Notification    = require('../Models/Notification');
var Visitor         = require('../Models/Visitor');
var UserType        = require('../Models/UserType');
var Constants       = require('../Misc/Constants');
var Station         = require('../Models/Station');
var Tdot            = require('../Models/Tdot');
var User            = require('../Models/User');
var Permission      = require('../Misc/Permission');
var LiveSocket         = require('../Misc/LiveSocket');
var express         = require('express');
var router          = express.Router();
var errorManager    = require('../ErrorManager/ErrorManager');
var ErrorType       = require('../ErrorManager/ErrorTypes');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

router.route('/notification')
.post(guard.check(Permission.PERMISSION_NOTIFICATION_POST), function(req, res, next) {
  if(req.body.Station == Constants.START || req.body.Station == Constants.END) {
    console.log('new notific');

    if(req.body.Station == Constants.START) {
      console.log('Send guideentered-paket: ' + req.body.Guide);
      LiveSocket.sendGuideEntered(req.body.Guide);
    }

    if(req.body.Station == Constants.END) {
      LiveSocket.sendGuideLeft(req.body.Guide);
    }

    Notification.remove({Guide: req.body.Guide}, function(err) {
      if(err) {
        return next(errorManager.getAppropriateError(err));
      }

      console.log('notifications removed');
      res.send();
    });
  } else {
    Tdot.findOne({IsCurrent: true}, function(err, tdot) {
        if(err) {
          return next(errorManager.getAppropriateError(err));
        }

        if(!tdot) {
            return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
        }

        User.findOne({_id: req.body.Guide}, function(err, user) {
          if(err) {
            return next(errorManager.getAppropriateError(err));
          }

          if(!user) {
            return next(errorManager.generate404NotFound('user not found', ErrorType.ERROR_USER_NOT_FOUND));
          }

          Station.findOne({_id: req.body.Station, Tdot: tdot._id}, function(err, station) {
            if(station) {
              stationID = station.id;
            } 

            if(err) {
              return next(errorManager.getAppropriateError(err));
            }

            if(!station) {
              return next(errorManager.generate404NotFound('station not found', ErrorType.ERROR_STATION_NOT_FOUND));
            }

            Notification.find({Guide: user._id, Tdot: tdot._id}).sort({$natural:-1}).limit(1).exec(function(err, notification) {
              if(err) {
                res.send();
                return;
              }

              if(notification.length > 0 && (notification[0].Station == station.id)) {
                res.send('already visiting');
              } else {
                var notification = new Notification({Guide: user._id, Name: user.Username, Tdot: tdot._id, Station: station._id, Position: station.Position.id, Time: new Date()});

                notification.save(function(err) {
                  

                  if(err) {
                    return next(errorManager.getAppropriateError(err));
                  }

                  LiveSocket.sendNotification({ Guide: { id: user._id, name: user.Username }, Position: station.Position.id });
                  console.log('New Notification');
                  res.send('saved');
                });         
              }
            });
          });
        });
    });
  }
});

router.route('/notification')
.get(guard.check(Permission.PERMISSION_NOTIFICATION_GET), function(req, res, next) {
  Notification.find(req.query, function(err, notifications) {
    if(err)
      return next(errorManager.getAppropriateError(err)); 

      res.send(notifications);
  });
});