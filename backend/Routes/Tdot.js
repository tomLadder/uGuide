var Tdot            = require('../Models/Tdot');
var Permission     = require('../Misc/Permission');
var express         = require('express');
var router          = express.Router();
var errorManager    = require('../ErrorManager/ErrorManager');
var ErrorType       = require('../ErrorManager/ErrorTypes');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

/* Map */
router.route('/tdot/positions')
.get(guard.check(Permission.PERMISSION_TDOT_POSITIONS_GET), function(req, res, next) {
  Tdot.findOne({IsCurrent: true}, "Points",  function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    res.send(tdot.Points);
  });
});

router.route('/tdot/map/:_id')
.put(guard.check(Permission.PERMISSION_TDOT_MAP_ID_PUT), function(req, res, next) {
  Tdot.findById(req.params._id, function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('Tdot with _id ' + req.params._id + ' not found', ErrorType.ERROR_TDOT_NOT_FOUND));
    }

    tdot.Map = req.body.Map;
    tdot.Points = req.body.Points;

    console.log(tdot);

    Tdot.update({_id: tdot._id}, tdot, function(err) {
      if(err)
        return next(err);

      res.send();
    });
  });
});

router.route('/tdot/map/:_id')
.get(guard.check(Permission.PERMISSION_TDOT_MAP_ID_GET), function(req, res, next) {
  Tdot.findById(req.params._id, "Map Points", function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('Tdot with _id ' + req.params._id + ' not found', ErrorType.ERROR_TDOT_NOT_FOUND));
    }

    res.send(tdot);
  });  
});

/* Map - End */

router.route('/tdot/lock')
.post(guard.check(Permission.PERMISSION_TDOT_LOCK_POST), function(req, res, next) {
  var updates = { $set: { IsLocked: true } };
  Tdot.update({IsCurrent: true}, updates, function(err) {
    if(err) {
      return next(err);
    }

    res.send();
  });
});

router.route('/tdot/unlock')
.post(guard.check(Permission.PERMISSION_TDOT_UNLOCK_POST), function(req, res, next) {
  var updates = { $set: { IsLocked: false } };
  Tdot.update({IsCurrent: true}, updates, function(err) {
    if(err) {
      return next(err);
    }

    res.send();
  });
});

router.route('/tdot/current')
.get(guard.check([Permission.PERMISSION_TDOT_CURRENT_GET]), function(req, res, next) {
  Tdot.findOne({IsCurrent: true}, "Year IsCurrent IsLocked",  function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    res.send(tdot);
  });
});

router.route('/tdot/possible')
.get(guard.check(Permission.PERMISSION_TDOT_POSSIBLE_GET), function(req, res, next) {
    var possibleYears = [];
    var year = new Date().getFullYear();

    for(var i=0;i<5;i++) {
      possibleYears.push(year + i);
    }

    console.log(possibleYears);
    res.send(possibleYears);
});

router.route('/tdot/current/:_id')
.post(guard.check(Permission.PERMISSION_TDOT_CURRENT_ID_POST), function(req, res, next) {

  Tdot.findById(req.params._id, function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('Tdot with _id ' + req.params._id + ' not found', ErrorType.ERROR_TDOT_NOT_FOUND));
    }

    Tdot.update({}, {IsCurrent: false},  { multi: true }, function(err, num) {
      if(err)
        return next(err);

      Tdot.findOneAndUpdate({_id:req.params._id}, {IsCurrent: true}, {new: true}, function(err, tdot) {
        if (err) {
          return next(errorManager.getAppropriateError(err));
        } else {
          res.send('ok');
        }
      });
    });
  });
});

router.route('/tdot/:_id')
.get(guard.check(Permission.PERMISSION_TDOT_ID_GET), function(req, res, next) {
  Tdot.findById(req.params._id, "Year IsCurrent IsLocked", function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('Tdot with _id ' + req.params._id + ' not found', ErrorType.ERROR_TDOT_NOT_FOUND));
    }

    res.send(tdot);
  });
})
.put(guard.check(Permission.PERMISSION_TDOT_ID_PUT), function(req, res, next) {
  Tdot.findOneAndUpdate({_id:req.params._id}, req.body, {new: true}, function(err, tdot) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.send(tdot);
    }
  });
})
.delete(guard.check(Permission.PERMISSION_TDOT_ID_DELETE), function(req, res, next) {
  Tdot.findByIdAndRemove(req.params._id, function(err) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.status(204).send();
    }
  })
});

router.route('/tdot')
.get(guard.check(Permission.PERMISSION_TDOT_GET), function(req, res, next) {
  Tdot.find(req.query, "Year IsCurrent IsLocked", function(err, tdots) {
      if (err) {
        return res.send(err);
      }

      res.send(tdots);
  });
})
.post(guard.check(Permission.PERMISSION_TDOT_POST), function(req, res, next) {
  var tdot = new Tdot(req.body);
  tdot.IsCurrent = false;

  tdot.save(function(err) {
    if(err) {
      return next(errorManager.getAppropriateError(err));
    }

    res.send({message: 'Tdot successfully added'});
  });
});
