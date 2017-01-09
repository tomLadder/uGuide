(function () {
angular.module('adminTdot', [])

.controller('adminTdotCtrl', function ($rootScope, $scope, $timeout, tdotFactory) {
    $scope.tdots = [];
    $scope.currentTdot = {};
    $scope.newTdot = {};
    $scope.nextTdots = [];

    $scope.alert = {};

    $scope.isTdotLocked = false;

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
        $scope.loadNextTdots();

        $scope.loadTdots();

        $scope.getCurrentTdot();

        $scope.jQueryInjection();
    }

    $scope.loadNextTdots = function() {
        tdotFactory.getNextTdots().then
        (
            function(successResponse) {
                $scope.nextTdots = successResponse.data;
                console.log("Next Tdots loaded");
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.jQueryInjection = function() {
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

    $scope.setCurrentTdot = function(t) {
        console.log(t._id);
        tdotFactory.setCurrentTdot(t._id).then
        (
            function(successResponse) {
                $scope.loadTdots();
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.getCurrentTdot = function() {
        tdotFactory.getCurrentTdot().then
        (
            function(successResponse) {
                $scope.currentTdot = successResponse.data;
                console.log("Islocked -> " + $scope.currentTdot.IsLocked);
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.addTdot = function() {
        console.log($scope.newTdot.Year);
        tdotFactory.addTdot($scope.newTdot.Year).then
        (
            function(successResponse) {
                $scope.loadTdots();
                $scope.loadNextTdots();
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.toggleLockTdot = function() {
        if($scope.currentTdot.IsLocked == false) {
            $scope.unlockCurrentTdot();
        }
        else {
            $scope.lockCurrentTdot();
        }

        $scope.getCurrentTdot();  
    }

    $scope.lockCurrentTdot = function() {
        tdotFactory.lockTdot().then
        (
            function(successResponse) {
                console.log('TdoT is locked');
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.unlockCurrentTdot = function() {
        tdotFactory.unlockTdot().then
        (
            function(successResponse) {
                console.log('TdoT is unlocked');
            },
            function(errorResponse) {
                console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    $scope.showLockInfo = function() {
        $scope.addAlert('warning', 'Lock Info', 'With checking this box you lock/unlock the current selected TdoT');
        //$timeout($scope.resetAlert, 3000);
    }

    $scope.removeLockInfo = function() {
        $scope.resetAlert();
    }
});
})();