(function () {
var stationApp = angular.module('user', [])

stationApp.factory('userFactory', function($http, $window, $q, ApiConstant) {
    var factory = {};

    factory.addUser = function(username, type, password) {
		return $http({
			method: 'POST',
			url: ApiConstant.url + '/user',
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
			url: ApiConstant.url + '/user/' + _id,
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
			url: ApiConstant.url + '/user/' + _id,
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
			url: ApiConstant.url + '/user',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.addMultipleUsers = function(userWrapper) {
		return $http({
			method: 'POST',
			url: ApiConstant.url + '/user/multiple',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify(userWrapper)
		});
	}

	factory.exportMultipleUsers = function(userWrapper) {
		return $http({
			method: 'POST',
			responseType: 'arraybuffer',
			url: ApiConstant.url + '/user/export',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify(userWrapper)
		});
	}

	factory.deleteMultipleUsers = function(userWrapper) {
		return $http({
			method: 'DELETE',
			url: ApiConstant.url + '/user/multiple',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify(userWrapper)
		});
	}

    return factory;
});
})();