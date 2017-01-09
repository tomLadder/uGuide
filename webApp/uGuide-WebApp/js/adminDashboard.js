(function () {
angular.module('adminDashboard', [])

.controller('adminDashboardCtrl', function ($rootScope, $scope, $timeout, NgMap, tdotFactory) {
    $scope.alert = {};

    $scope.tdots = [];
    $scope.tdotStats = {};
    $scope.tdotStats.BasicStats = {};

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

                $scope.initDashboardElements();
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.initDashboardElements = function() {
        $scope.labelsGender = ['Male', 'Total', 'Female'];

        // $scope.seriesGender = ['Male', 'Female'];

        $scope.dataGender = [
            [$scope.tdotStats.BasicStats.Male, $scope.tdotStats.BasicStats.Total, $scope.tdotStats.BasicStats.Female]
        ];


        $scope.labelsLocation = $scope.tdotStats.VisitorStats.map(function(x) {
            return String(x._id);
        });

        $scope.dataLocation = $scope.tdotStats.VisitorStats.map(function(x) {
            return x.count;
        })
    }

    $scope.setSelectedTdot = function(t) {
        $scope.selectedTdot = {};
        $scope.selectedTdot = t;

        $scope.loadTdotStats($scope.selectedTdot.Year);
    }

    $scope.downloadStatisticExport = function() {
        tdotFactory.downloadStatistics($scope.selectedTdot.Year).then
        (
            function(successResponse) {
                console.log("Tdots stats exported");

                var blob = new Blob([successResponse.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                saveAs(blob, 'uGuide_' + String($scope.selectedTdot.Year) + '_statisticExport.xls');
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );

        
    }


});
})();