var xtend = require('xtend')
var errorManager = require('./ErrorManager/ErrorManager');

var Guard = function (options) {
  var defaults = {
    requestProperty: 'user',
    permissionProperty: 'permission'
  }
  this._options = xtend(defaults, options)
}

Guard.prototype = {

  check: function (required) {
    if (typeof required === 'string') required = [required]

    return _middleware.bind(this)

    function _middleware (req, res, next) {
      var self = this
      var options = self._options

      if (!options.requestProperty) {
        return next(errorManager.generate401Unauthorized('requestProperty hasn\'t been defined. Check your configuration.'));
      }

      var user = req[options.requestProperty]
      if (!user) return next()

      var permission = user[options.permissionProperty]

      if (!permission) {
        return next(errorManager.generate401Unauthorized('Could not find permission for user. Bad configuration?'));
      }

      var sufficient = required.indexOf(permission) > -1;

      return next(!sufficient ? errorManager.generate401Unauthorized('Permission denied') : null)
    }
  }

}

module.exports = function (options) {
  return new Guard(options)
}
