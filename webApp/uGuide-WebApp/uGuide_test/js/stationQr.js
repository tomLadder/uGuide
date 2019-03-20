(function () {
angular.module('stationQr', [])

.controller('stationQrCtrl', function ($rootScope, $scope, $location, stationFactory) {
    $scope.alert = {};
    $scope.helper = {};

    $scope.selectedStation = {};
    $scope.stations = [];

    //alertTypes -> warning (yellow), danger (red), success (green)
    $scope.addAlert = function(alertType, title, msg) {
        $scope.alert.type = alertType;
        $scope.alert.show = true;
        $scope.alert.title = title;
        $scope.alert.message = msg;
    }

    $scope.resetAlert = function() {
        $scope.alert = {};
    }

    $scope.init = function() {
        $scope.jQueryInjection();

        $scope.helper.isStationSelected = false;

        stationFactory.getStationsWithQR().then
        (
            function(successResponse) {
                $scope.stations = successResponse.data;
                console.log("Stations loaded");
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.selectStation = function(s) {
        $scope.helper.isStationSelected = true;
        $scope.selectedStation.Name = s.Name;
        $scope.selectedStation.QR = s.QR;
    }

    $scope.jQueryInjection = function() {
        //JQuery injection möööö
        $('modalId').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }
});
})();