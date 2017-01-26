(function () {
var authApp = angular.module('authentication', [])

authApp.factory('authFactory', function(authChallenge, authToken, sha256, $http, $window, $q) {
		return {
			authenticationProcess: function(username, password) {
					deferred = $q.defer();
		      var pGetChallenge = authChallenge.getChallenge(username, password);
		      pGetChallenge.then
					(
		        function(successResponse) {
							var hash = sha256.convertToSHA256(password + successResponse.data.challenge);
							var pGetToken = authToken.getToken(username, hash);
		          pGetToken.then(
								function(successResponse) {
									$window.localStorage.setItem('token', successResponse.data.token);
									$window.localStorage.setItem('user', successResponse.data.user);
									deferred.resolve(successResponse);
		          	},
								function(errorResponse) {
									deferred.reject(errorResponse);
		          	}
							);
		        },
		        function(errorResponse) {
		          deferred.reject(errorResponse);
		      	}
				);

				return deferred.promise;
	    }
	}
});

authApp.factory('authChallenge', function($http, ApiConstant) {
  return {
    getChallenge: function(username) {
      return $http({
        method: 'POST',
        url: ApiConstant.url + '/challenge',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: 'username=' + username
      });
    }
  }
});

authApp.factory('authToken', function($http, ApiConstant) {
  return {
    getToken: function(username, hashedPassword) {
      return $http({
        method: 'POST',
        url: ApiConstant.url + '/auth',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: 'username=' + username + '&password=' + hashedPassword
      });
    }
  }
});

})();
