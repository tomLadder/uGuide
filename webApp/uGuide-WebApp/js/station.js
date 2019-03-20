(function () {
var stationApp = angular.module('station', [])

stationApp.factory('stationFactory', function($http, $window, $q) {
	var factory = {};
	var SERVER_IP = 'http://84.200.7.248:8000';

	factory.addStation = function(name, grade, subject, description, position) {
		return $http({
			method: 'POST',
			url: SERVER_IP + '/api/station',
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
			url: SERVER_IP + '/api/station/' + _id,
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
			url: SERVER_IP + '/api/station/' + _id,
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
			url: SERVER_IP + '/api/station/current',
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
			url: SERVER_IP + '/api/station/current/qr',
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
			url: SERVER_IP + '/api/station/current/pp',
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
