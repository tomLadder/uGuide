var Station             = require('../Models/Station');
var Tdot                = require('../Models/Tdot');
var Permission          = require('../Misc/Permission');
var UserType            = require('../Models/UserType');
var TimeConstant        = require('../Models/TimeConstant');
var express             = require('express');
var qr                  = require('qr-image');
var router              = express.Router();
var errorManager        = require('../ErrorManager/ErrorManager');
var ErrorType           = require('../ErrorManager/ErrorTypes');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

router.route('/station/qr')
.get(guard.check(Permission.PERMISSION_STATION_QR_GET), function(req, res, next) {
  Station.find({User: req.token.sub}, function(err, stations) {
      if (err) 
        return next(errorManager.getAppropriateError(err));

      var qr_infos = [];

      for(var i=0;i<stations.length;i++) {
        var svg = qr.imageSync(String(stations[i]._id), { type: 'png', size: 10 });

        qr_infos.push({Name: stations[i].Name, QR: new Buffer(svg).toString('base64')});
      }

      res.send(qr_infos);
  });
});

router.route('/station/qr/:_id')
.get(guard.check(Permission.PERMISSION_STATION_QR_ID_GET), function(req, res, next) {
  Station.findById(req.params._id, function(err, station) {
      if (err)
        return next(errorManager.getAppropriateError(err));

      if(!station) {
        return next(errorManager.generate404NotFound('Station with _id ' + req.params._id + ' not found', ErrorType.ERROR_STATION_NOT_FOUND));
      }

      var svg = qr.imageSync(String(station._id), { type: 'png', size: 10 });

      res.send({Name: station.Name, QR: new Buffer(svg).toString('base64')});
  });
});

router.route('/station/current/qr')
.get(guard.check(Permission.PERMISSION_STATION_CURRENT_QR_GET), function(req, res, next) {
    Tdot.findOne({IsCurrent: true}, function(err, tdot) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    if(req.token.type == UserType.STATION) {
    Station.find({Tdot: tdot._id, User: req.token.sub}, function(err, stations) {
        if (err) 
            return next(errorManager.getAppropriateError(err));

          var stations = stations.map(function(station) {
            station = station.toObject();
            var png = qr.imageSync(String(station._id), { type: 'png', size: 10 });
            station["QR"] = new Buffer(png).toString('base64');
            return station;
          });

          res.send(stations);
      });
    } else if(UserType.ADMIN) {
    Station.find({Tdot: tdot._id}, function(err, stations) {
        if (err) 
            return next(errorManager.getAppropriateError(err));

          var stations = stations.map(function(station) {
            station = station.toObject();
            var png = qr.imageSync(String(station._id), { type: 'png', size: 10 });
            station["QR"] = new Buffer(png).toString('base64');
            return station;
          });


          res.send(stations);
      });      
    }
  });
});

router.route('/station/current/pp')
.get(guard.check(Permission.PERMISSION_STATION_CURRENT_POSITIONPLAN), function (req, res, next) {
    Tdot.findOne({IsCurrent: true}, function(err, tdot) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    Station.find({Tdot: tdot._id}, 'Name Position', function(err, stations) {
        if (err) 
          return next(errorManager.getAppropriateError(err));

        res.send(stations);
    });
  });
});

router.route('/station/current/')
.get(guard.check(Permission.PERMISSION_STATION_CURRENT_GET), function (req, res, next) {
    Tdot.findOne({IsCurrent: true}, function(err, tdot) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    if(req.token.type == UserType.STATION) {
      Station.find({User: req.token.sub, Tdot: tdot._id}, function(err, stations) {
          if (err) 
            return next(errorManager.getAppropriateError(err));

          res.send(stations);
      });
    } else {
      Station.find({Tdot: tdot._id}, function(err, stations) {
          if (err)
            return next(errorManager.getAppropriateError(err));

          res.send(stations);
      });
    }
  });
});

router.route('/station/:_id')
.get(guard.check(Permission.PERMISSION_STATION_ID_GET), function(req, res, next) {
  Station.findById(req.params._id, function(err, station) {
    if(err)
      return next(err);

    if(!station) {
        return next(errorManager.generate404NotFound('Station with _id ' + req.params._id + ' not found', ErrorType.ERROR_STATION_NOT_FOUND));
    }

    res.send(station);
  })
})
.put(guard.check(Permission.PERMISSION_STATION_ID_PUT), function(req, res, next) {
  Tdot.findOne({IsCurrent: true}, function(err, tdot) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    Station.findOneAndUpdate({_id:req.params._id, Tdot: tdot._id}, req.body, {new: true}, function(err, station) {
      if (err) {
        return next(errorManager.getAppropriateError(err));
      } else {
        res.send(station);
      }
    });
  });
})
.delete(guard.check(Permission.PERMISSION_STATION_ID_DELETE), function(req, res, next) {
  Tdot.findOne({IsCurrent: true}, function(err, tdot) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    Station.remove({_id: req.params._id, Tdot: tdot._id}, function(err) {
      if (err) {
        return next(errorManager.getAppropriateError(err));
      } else {
        res.status(204).send();
      }
    });
  });
});

router.route('/station')
.get(guard.check(Permission.PERMISSION_STATION_GET), function(req, res, next) {
  if(req.token.type == UserType.STATION) {
    Station.find({User: req.token.sub}, function(err, stations) {
        if (err)
          return next(errorManager.getAppropriateError(err));

        res.send(stations);
    });
  } else {
    Station.find({}, function(err, stations) {
        if (err)
          return next(errorManager.getAppropriateError(err));

        res.send(stations);
    });
  }
})
.post(guard.check(Permission.PERMISSION_STATION_POST), function(req, res, next) {
  Tdot.findOne({IsCurrent: true}, function(err, tdot) {
    if(err)
      return next(errorManager.getAppropriateError(err));

    if(!tdot)
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));

    var station = new Station(req.body);
    station.User = req.token.sub;
    station.Tdot = tdot._id;

    station.save(function(err) {
      if(err)
        return next(errorManager.getAppropriateError(err));

      res.send({message: 'Station successfully added'});
    });
  });
});