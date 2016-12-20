(function () {
angular.module('adminNavigation', [])

.controller('adminNavCtrl', function ($rootScope, $scope, $location, $window) {
    $scope.showUsermanagement = function() {
        $location.path('/adminUserManagement');
    }

    $scope.page = '';

    $scope.isPageSelected = function(page){
        return page == $scope.page;
    }

    $scope.logout = function() {
        $window.localStorage.removeItem('token');
    }
});
})();