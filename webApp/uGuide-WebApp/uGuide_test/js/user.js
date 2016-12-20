(function () {
var stationApp = angular.module('user', [])

stationApp.factory('userFactory', function($http, $window, $q) {
    var factory = {};
	var SERVER_IP = 'http://84.200.7.248:8000';

    factory.addUser = function(username, type, password) {
		return $http({
			method: 'POST',
			url: SERVER_IP + '/api/user',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify({ Username: username, Type: type, Password: password })
		});
	}

    factory.updateUser = function(_id, username, type, password) {
		return $http({
			method: 'PUT',
			url: SERVER_IP + '/api/user/' + _id,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify({ Username: username, Type: type, Password: password })
		});
	}

    factory.deleteUser = function(_id) {
		return $http({
			method: 'DELETE',
			url: SERVER_IP + '/api/user/' + _id,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

    factory.getUsers = function() {
		return $http({
			method: 'GET',
			url: SERVER_IP + '/api/user',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

    return factory;
});
})();