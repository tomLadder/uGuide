var Visitor = require('../Models/Visitor');
var express = require('express');
var router = express.Router();
var errorManager = require('../ErrorManager/ErrorManager');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permission'
});

module.exports = router;

router.route('/visitor/:_id')
.get(guard.check('admin'), function(req, res, next) {
  Visitor.findById(req.params._id, function(err, visitor) {
    if(err)
      return next(err);

    if(!visitor) {
      return next(errorManager.generate404NotFound('Visitor with _id ' + req.params.id + ' not found'));
    }

    res.send(visitor);
  })
})
.put(guard.check('admin'), function(req, res, next) {
  Visitor.findOneAndUpdate({_id:req.params._id}, req.body, {new: true}, function(err, visitor) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.send(visitor);
    }
  });
})
.delete(guard.check('admin'), function(req, res, next) {
  Visitor.findByIdAndRemove(req.params._id, function(err) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.status(204).send();
    }
  })
});

router.route('/visitor')
.get(guard.check('admin'), function(req, res, next) {
  Visitor.find(req.query, function(err, visitors) {
      if (err) {
        return res.send(err);
      }

      res.send(visitors);
  });
})
.post(guard.check('admin'), function(req, res, next) {
  var visitor = new Visitor(req.body);

  visitor.save(function(err) {
    if(err) {
      return next(errorManager.getAppropriateError(err));
    }

    res.send({message: 'Visitor successfully added'});
  });
});
