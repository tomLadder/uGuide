(function () {
angular.module('adminDashboard', [])

.controller('adminDashboardCtrl', function ($rootScope, $scope, $timeout, NgMap, tdotFactory) {
    $scope.alert = {};

    $scope.tdots = [];
    $scope.tdotStats = {};

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
        $scope.loadTdots();

        $scope.addAlert('warning', 'Info', 'Please press a Tdot - Button!');
        $timeout($scope.resetAlert, 4000);

        $scope.labels = ['Male', 'Female'];

        $scope.series = ['Male', 'Female'];

        $scope.data = [
            [65, 28]
        ];

        $scope.addresses = [
            { address: '9500' },
            { address: '9020' },
            { address: '9100' },
            { address: '9300' }
        ];
    }

    $scope.jQueryInjection = function() {
        //JQuery injection möööö
        $('modalId').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    $scope.loadTdots = function() {
        tdotFactory.getTdots().then
        (
            function(successResponse) {
                $scope.tdots = successResponse.data;
                console.log("Tdots loaded");
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.loadTdotStats = function(year) {
        tdotFactory.getTdotStatistics(year).then
        (
            function(successResponse) {
                $scope.tdotStats = successResponse.data;
                console.log("Tdots stats loaded");
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.setSelectedTdot = function(t) {
        $scope.selectedTdot = {};
        $scope.selectedTdot = t;

        $scope.loadTdotStats($scope.selectedTdot.Year);
    }
});
})();