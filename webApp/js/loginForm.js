(function () {
angular.module('loginForm', [])

.controller('loginFormCtrl', function ($rootScope, $scope, $location, $window, authFactory) {
  $scope.user = {};
  $scope.alert = [];

  $rootScope.session = {};

  $scope.init = function() {
    $('modalId').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

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

  $scope.login = function() {

    $scope.resetAlert();

    authFactory.authenticationProcess($scope.user.username, $scope.user.password).then
    (
      function(successResponse) {
        if(successResponse.data.user.type == 2) {
          $location.path('/stationEdit');
        } else if(successResponse.data.user.type == 1) {
          $location.path('/tdotManagement');
        }
      },
      function(errorResponse) {
        $scope.addAlert('danger', errorResponse.data.code, 'Login failed!');
        $scope.user.username = '';
        $scope.user.password = '';
      }
    );
  };
});

})();
