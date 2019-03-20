(function () {
var stationApp = angular.module('tdot', [])

stationApp.factory('tdotFactory', function($http, $window, $q, ApiConstant) {
    var factory = {};

    factory.addTdot = function(year) {
		return $http({
			method: 'POST',
			url: ApiConstant.url + '/tdot',
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
			url: ApiConstant.url + '/tdot',
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
			url: ApiConstant.url + '/tdot/current',
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
			url: ApiConstant.url + '/tdot/current/' + _id,
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
			url: ApiConstant.url + '/tdot/possible',
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
			url: ApiConstant.url + '/statistic/' + year,
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
			url: ApiConstant.url + '/tdot/lock',
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
			url: ApiConstant.url + '/tdot/unlock',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.getMap = function(id) {
		return $http({
			method: 'GET',
			url: ApiConstant.url + '/tdot/map/' + id,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			}
		});
	}

	factory.saveMap = function(id, mapData) {
		return $http({
			method: 'PUT',
			url: ApiConstant.url + '/tdot/map/' + id,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
			data: JSON.stringify(mapData)	
		});
	}

	factory.downloadStatistics = function(year) {
		return $http({
			method: 'GET',
			responseType: 'arraybuffer',
			url: ApiConstant.url + '/statistic/export/' + year,
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
		});
	}

	factory.getPositionTags = function() {
		return $http({
			method: 'GET',
			url: ApiConstant.url + '/tdot/positions',
			headers:
			{
				'Content-Type': 'application/json',
				'x-access-token': $window.localStorage.getItem("token")
			},
		});
	}

    return factory;
});
})();