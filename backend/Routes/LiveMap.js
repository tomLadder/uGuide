var express         = require('express');
var router          = express.Router();
var Tdot            = require('../Models/Tdot');

module.exports = router;

router.route('/livemap/info')
.get(function(req, res, next) {
  
  Tdot.findOne({IsCurrent: true}, "Map Points",  function(err, tdot) {
    if(err)
      return next(err);

    if(!tdot) {
        return next(errorManager.generate404NotFound('current Tdot not set', ErrorType.ERROR_CURRENT_TDOT_NOT_SET));
    }

    res.send(tdot);
  });
});
