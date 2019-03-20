var ErrorType = require('./ErrorTypes');

module.exports =
{
  getAppropriateError: function (err) {
    if(err.name === 'MongoError' && err.code === 11000) {
      return this.generate409Conflict(ErrorType.ERROR_DATABASE);
    } else {
      return err;
    }
  },
  generate404NotFound: function(message, errorType) {
    var error_code = 404;

    var error = new Error();
    error.status = error_code;
    error.message = {code: error_code, error:message, errorType: errorType};

    return error;
  },
  generate409Conflict: function() {
    var error_code = 409;

    var error = new Error();
    error.status = error_code;
    error.message = {code: error_code, error:'The request could not be completed due to a conflict with the current state of the resource.', errorType: ErrorType.ERROR_UNKNOWN };

    return error;
  },
  generate401Unauthorized: function(message, errorType) {
    var error_code = 401;

    var error = new Error();
    error.status = error_code;
    error.message = {code: error_code, error:message, errorType: errorType };

    return error;
  },
  generate403Forbidden: function(message, errorType) {
    var error_code = 403;

    var error = new Error();
    error.status = error_code;
    error.message = {code: error_code, error:message, errorType: errorType };

    return error;
  },
  generate500InternalServerError: function(message, errorType) {
    var error_code = 500;

    var error = new Error();
    error.status = error_code;
    error.message = {code: error_code, error:message, errorType: errorType };

    return error;
  }
}
