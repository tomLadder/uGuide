var Permission          = require('../Misc/Permission');
var express             = require('express');
var router              = express.Router();
var errorManager        = require('../ErrorManager/ErrorManager');
var Stats               = require('../Misc/Stats');
var Tdot                = require('../Models/Tdot');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

module.exports = router;

router.route('/statistic/export/:year')
.get(guard.check(Permission.PERMISSION_STATISTIC_EXPORT_YEAR_GET), function(req, res, next) {
    Tdot.findOne({Year: Number(req.params.year)}, function(err, tdot) {
      if(err)
        return next(err);

      if(!tdot) {
          return next(errorManager.generate404NotFound('Tdot not found'));
      }

      res.send('ok');
    });
});

router.route('/statistic/:year')
.get(guard.check([Permission.PERMISSION_STATISTIC_YEAR_GET]), function(req, res, next) {
  Tdot.findOne({Year: Number(req.params.year)}, function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('Tdot not found'));
    }

    Stats.getBasicStats(tdot._id, function (basicStats) {
        Stats.getFeedbackStats(tdot._id, function(feedbackStats) {
            Stats.getVisitorStats(tdot._id, function(visitorStats) {
                res.send({BasicStats: basicStats, FeedbackStats: feedbackStats, VisitorStats: visitorStats});
            });
        });
    });
  });
});