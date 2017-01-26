(function () {
  var app = angular.module('initiator', ['ngRoute', 'angularCSS', 'angular-encryption', 'authentication', 'admin', 'loginForm', 'stationEdit', 'station', 'stationNavBar', 'stationQr', 'adminNavigation', 'tdot', 'user', 'adminMap', 'adminStation', 'adminUser', 'adminTdot', 'adminDashboard', 'chart.js', 'ngMap']);

  app.constant('ApiConstant', {
      'url': 'http://127.0.0.1:8000/api'
  });

  app.controller('ctrl', function() {

  });

  app.config(function($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl : 'templates/login.html',
        css: 'css/login.css'
    })
    .when('/stationEdit', {
        templateUrl : 'templates/stationEdit.html',
        css: 'css/stationEdit.css'
    })
    .when('/admin', {
        templateUrl : 'templates/admin.html',
        css: 'css/admin.css'
    })
    .when('/stationQr', {
        templateUrl : 'templates/stationQr.html',
        css: 'css/stationQr.css'
    })
    .when('/tdotManagement', {
        templateUrl : 'templates/adminTdot.html',
        css: 'css/adminTdot.css'
    })
    .when('/userManagement', {
        templateUrl : 'templates/adminUser.html',
        css: 'css/adminUser.css'
    })
    .when('/stationView', {
        templateUrl : 'templates/adminStation.html',
        css: 'css/adminStation.css'
    })
    .when('/tdotMap', {
        templateUrl : 'templates/adminMap.html',
        css: 'css/adminMap.css'
    })
    .when('/dashboard', {
        templateUrl : 'templates/adminDashboard.html',
        css: 'css/adminDashboard.css'
    })
    .otherwise({
      redirectTo: '/login'
    });
  });

})();
