var User            = require('../Models/User');
var Visitor         = require('../Models/Visitor');
var UserType        = require('../Models/UserType');
var Permission      = require('../Misc/Permission');
var Office          = require('../Misc/Office');
var errorManager    = require('../ErrorManager/ErrorManager');
var ErrorType       = require('../ErrorManager/ErrorTypes');
var express         = require('express');
var mongoose        = require('mongoose');
var router          = express.Router();

var fs = require('fs');
var path = require('path');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

router.route('/user/export')
.post(guard.check(Permission.PERMISSION_USER_EXPORT_POST), function(req, res, next) {
    var ids = req.body;
    var arr = ids.map(function(item) {return item.id});

    User.find({_id: {$in: arr}}, function(err, users) {
      if(err)
        return next(errorManager.getAppropriateError(err));   
      
      var arr = [];
      for(var i=0;i<users.length;i++) {
        arr.push([users[i].Username, users[i].Password]);
      }

      var docx = Office.generateUserDocument(arr, function(err) {
        return next(errorManager.generate500InternalServerError("Failed to generate document", ErrorType.ERROR_DOC_GENERATION_FAILED));
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-disposition', 'attachment; filename=users.docx');
      docx.generate(res);
    });
});

router.route('/user/multiple')
.post(guard.check(Permission.PERMISSION_USER_MULTIPLE_POST), function(req, res, next) {
  var req = req.body;
  var users= [];

  console.log(req.Type);
  for(var i=0;i<req.Users.length;i++) {
    var user = new User({Username: req.Users[i].User, Type: req.Type, Password: 'HelloWorld'});
    users.push(user);
  }

  User.insertMany(users)
  .then(function (result) {
      res.send({message: 'Users successfully added'});
  })
  .catch(function(err){
      return next(errorManager.getAppropriateError(err));
  })
})
.delete(guard.check(Permission.PERMISSION_USER_MULTIPLE_DELETE), function(req, res, next) {
  var ids = req.body;

  ids.forEach(function(item) {
    User.findByIdAndRemove(item.id, function(err) {});
    console.log(item.id);
  });

  res.send();
});

router.route('/user/tour')
.get(guard.check(Permission.PERMISSION_USER_TOUR_GET), function(req, res, next) {
    Visitor.findOne({Guide: req.token.sub, IsFinished: false}, function(err, visitor) {
      if(err)
        return next(errorManager.getAppropriateError(err));

      if(visitor)
        res.send({Tour: true});
      else
        res.send({Tour: false});
  })
});

router.route('/user/:_id')
.get(guard.check(Permission.PERMISSION_USER_ID_GET), function(req, res, next) {
  User.findById(req.params._id, function(err, user) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('User with _id ' + req.params._id + ' not found', ErrorType.ERROR_USER_NOT_FOUND));
    }

    res.send(user);
  })
})
.put(guard.check(Permission.PERMISSION_USER_ID_PUT), function(req, res, next) {
  User.findOneAndUpdate({_id:req.params._id}, req.body, {new: true}, function(err, user) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.send(user);
    }
  });
})
.delete(guard.check(Permission.PERMISSION_USER_ID_DELETE), function(req, res, next) {
  User.findByIdAndRemove(req.params._id, function(err) {
    if (err) {
      return next(errorManager.getAppropriateError(err));
    } else {
      res.status(204).send();
    }
  })
});

router.route('/user')
.get(guard.check(Permission.PERMISSION_USER_GET), function(req, res, next) {
  User.find(req.query, function(err, users) {
      if (err) {
        return res.send(err);
      }

      res.send(users);
  });
})
.post(guard.check(Permission.PERMISSION_USER_POST), function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err) {
    if(err) {
      return next(errorManager.getAppropriateError(err));
    }

    res.send({message: 'User successfully added'});
  })
});