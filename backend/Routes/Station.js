var Station = require('../Models/Station');
var express = require('express');
var qr = require('qr-image');
var router = express.Router();
var errorManager = require('../ErrorManager/ErrorManager');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permission'
});

module.exports = router;

router.route('/station/qr')
.get(guard.check(['admin', 'guide']), function(req, res, next) {
  Station.find(function(err, stations) {
      if (err) {
        return res.send(err);
      }

      var qr_infos = [];

      for(var i=0;i<stations.length;i++) {
        var svg = qr.imageSync(String(stations[i]._id), { type: 'png', size: 10 });

        qr_infos.push({name: stations[i].Name, qr: new Buffer(svg).toString('base64')});
      }

      res.send(qr_infos);
  });
})

router.route('/station/:_id')
.get(guard.check(['admin', 'guide', 'station']), function(req, res, next) {
  Station.findById(req.params._id, function(err, station) {
    if(err)
      return next(err);

    if(!station) {
        return next(errorManager.generate404NotFound('Station with _id ' + req.params._id + ' not found'));
    }

    res.send(station);
  })
})
.put(guard.check(['admin', 'station']), function(req, res, next) {
  Station.findOneAndUpdate({_id:req.params._id}, req.body, {new: true}, function(err, station) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.send(station);
    }
  });
})
.delete(guard.check(['admin', 'station']), function(req, res, next) {
  Station.findByIdAndRemove(req.params._id, function(err) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.status(204).send();
    }
  })
});

router.route('/station')
.get(guard.check(['guide', 'admin', 'station']), function(req, res, next) {
  if(req.token.permission == 'station') {
    Station.find({User: req.token.sub}, function(err, stations) {
        if (err) {
          return res.send(err);
        }

        res.send(stations);
    });
  } else {
    Station.find(req.query, function(err, stations) {
        if (err) {
          return res.send(err);
        }

        res.send(stations);
    });
  }
})
.post(guard.check(['station', 'admin']), function(req, res, next) {
  var station = new Station(req.body);
  station.User = req.token.sub;
  station.Tdot = '5819f018eab7edb044967ea7';

  station.save(function(err) {
    if(err) {
      console.log(err);
      return next(errorManager.getAppropriateError(err));
    }

    res.send({message: 'Station successfully added'});
  });
});
