(function () {
var stationApp = angular.module('tdot', [])

stationApp.factory('tdotFactory', function($http, $window, $q) {
    var factory = {};
	var SERVER_IP = 'http://84.200.7.248:8000';

    factory.addTdot = function(year) {
		return $http({
			method: 'POST',
			url: SERVER_IP + '/api/tdot',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify({ Year: year })
		});
	}

    factory.getTdots = function() {
		return $http({
			method: 'GET',
			url: SERVER_IP + '/api/tdot',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

    factory.getCurrentTdot = function() {
		return $http({
			method: 'GET',
			url: SERVER_IP + '/api/tdot/current',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

    factory.setCurrentTdot = function(_id) {
		return $http({
			method: 'POST',
			url: SERVER_IP + '/api/tdot/current/' + _id,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.getNextTdots = function() {
		return $http({
			method: 'GET',
			url: SERVER_IP + '/api/tdot/possible',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.getTdotStatistics = function(year) {
		return $http({
			method: 'GET',
			url: SERVER_IP + '/api/statistic/' + year,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.lockTdot = function() {
		return $http({
			method: 'POST',
			url: SERVER_IP + '/api/tdot/lock',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.unlockTdot = function() {
		return $http({
			method: 'POST',
			url: SERVER_IP + '/api/tdot/unlock',
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