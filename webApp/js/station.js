(function () {
var stationApp = angular.module('station', [])

stationApp.factory('stationFactory', function($http, $window, $q, ApiConstant) {
	var factory = {};

	factory.addStation = function(name, grade, subject, description, position) {
		return $http({
			method: 'POST',
			url: ApiConstant.url + '/station',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify({ Name: name, Grade: grade, Subject: subject, Description: description, Position: position })
		});
	}

	factory.updateStation = function(_id, name, grade, subject, description, position) {
		return $http({
			method: 'PUT',
			url: ApiConstant.url + '/station/' + _id,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify({ Name: name, Grade: grade, Subject: subject, Description: description, Position: position })
		});
	}

	factory.deleteStation = function(_id) {
		return $http({
			method: 'DELETE',
			url: ApiConstant.url + '/station/' + _id,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.getStations = function() {
		return $http({
			method: 'GET',
			url: ApiConstant.url + '/station/current',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.getStationsWithQR = function() {
		return $http({
			method: 'GET',
			url: ApiConstant.url + '/station/current/qr',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.getStationsWithPosition = function() {
		return $http({
			method: 'GET',
			url: ApiConstant.url + '/station/current/pp',
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
