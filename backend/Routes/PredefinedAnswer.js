var PredefinedAnswer    = require('../Models/PredefinedAnswer');
var Permission          = require('../Misc/Permission');
var express             = require('express');
var router              = express.Router();
var errorManager        = require('../ErrorManager/ErrorManager');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

router.route('/answer')
.get(guard.check([Permission.PERMISSION_ANSWER_GET]), function(req, res, next) {
  PredefinedAnswer.find({}, function(err, answers) {
    if(err)
      return next(err);

    res.send(answers);
  });
});