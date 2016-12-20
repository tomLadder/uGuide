var xtend = require('xtend')
var errorManager = require('./ErrorManager/ErrorManager');

var Guard = function (options) {
  var defaults = {
    requestProperty: 'user',
    permissionProperty: 'permissions'
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

      var permissions = user[options.permissionProperty]

      if (!permissions) {
        return next(errorManager.generate401Unauthorized('Could not find permissions for user. Bad configuration?'));
      }

      var sufficient = required.every(function(elem, idx, arr) { return permissions.indexOf(elem) > -1 });

      return next(!sufficient ? errorManager.generate401Unauthorized('Permission denied') : null)
    }
  }

}

module.exports = function (options) {
  return new Guard(options)
}
