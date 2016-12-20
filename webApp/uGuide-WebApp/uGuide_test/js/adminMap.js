(function () {
angular.module('adminMap', [])

.controller('adminMapCtrl', function ($rootScope, $scope, $timeout, stationFactory) {
    $scope.stations = [];

    $scope.alert = {};

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

        stationFactory.getStationsWithPosition().then
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

    $scope.jQueryInjection = function() {
        //JQuery injection möööö
        $('modalId').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }
});
})();