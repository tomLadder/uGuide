var ErrorManager            = require('../ErrorManager/ErrorManager');
var ErrorType               = require('../ErrorManager/ErrorTypes');
var express           = require('express');
var moment            = require('moment');
var router            = express.Router();
var Permission          = require('../Misc/Permission');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

router.route('/offlinepackets')
.post(guard.check(Permission.PERMISSION_OFFLINEPACKETS_POST), function(req, res, next) {
    res.send('ok');
});