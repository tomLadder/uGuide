var Notification = require('../Models/Notification');
var express = require('express');
var router = express.Router();
var errorManager = require('../ErrorManager/ErrorManager');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permission'
});

module.exports = router;

router.route('/notification/:_id_station')
.post(guard.check(['guide']), function(req, res, next) {
  var notification = new Notification({User:req.token.sub, Station: req.params._id_station, Time: new Date()});

  notification.save(function(err) {
    if(err) {
      return next(errorManager.getAppropriateError(err));
    }

    res.send({message: 'Notification successfully added'});
  });
});

router.route('/notification')
.get(guard.check(['admin']), function(req, res, next) {
  Notification.find(req.query, function(err, notifications) {
      if (err) {
        return res.send(err);
      }

      res.send(notifications);
  });
});
