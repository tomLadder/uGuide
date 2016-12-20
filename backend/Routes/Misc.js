var express = require('express');
var router = express.Router();

module.exports = router;

router.route('/status')
.get(function(req, res, next) {
  res.send();
});
