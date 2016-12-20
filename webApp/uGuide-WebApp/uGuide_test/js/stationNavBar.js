(function () {
angular.module('stationNavBar', [])

.controller('navBarCtrl', function ($rootScope, $scope, $location, $window) {
    $scope.showStationView = function() {
        $location.path('/stationEdit');
    }

    $scope.showQrView = function() {
        $location.path('/stationQr');
    }

    $scope.logout = function() {
        $window.localStorage.removeItem('token');
    }
});
})();