var Tdot = require('../Models/Tdot');
var express = require('express');
var router = express.Router();
var errorManager = require('../ErrorManager/ErrorManager');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permission'
});

module.exports = router;

router.route('/tdot/:_id')
.get(guard.check('admin'), function(req, res, next) {
  Tdot.findById(req.params._id, function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('Tdot with _id ' + req.params._id + ' not found'));
    }

    res.send(tdot);
  });
})
.put(guard.check('admin'), function(req, res, next) {
  Tdot.findOneAndUpdate({_id:req.params._id}, req.body, {new: true}, function(err, tdot) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.send(tdot);
    }
  });
})
.delete(guard.check('admin'), function(req, res, next) {
  Tdot.findByIdAndRemove(req.params._id, function(err) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.status(204).send();
    }
  })
});

router.route('/tdot')
.get(guard.check('admin'), function(req, res, next) {
  Tdot.find(req.query, function(err, tdots) {
      if (err) {
        return res.send(err);
      }

      res.send(tdots);
  });
})
.post(guard.check('admin'), function(req, res, next) {
  var tdot = new Tdot(req.body);

  tdot.save(function(err) {
    if(err) {
      return next(errorManager.getAppropriateError(err));
    }

    res.send({message: 'Tdot successfully added'});
  });
});
