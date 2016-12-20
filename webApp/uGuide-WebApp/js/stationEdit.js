(function () {
angular.module('stationEdit', [])

.controller('stationEditCtrl', function ($rootScope, $scope, $location, $timeout, stationFactory) {
  $scope.helper = {};
  $scope.selectedStation = {};
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

    $scope.helper.formMode = 'Add';

    $scope.loadStations();
  }

  $scope.jQueryInjection = function() {
    //JQuery injection möööö
    $('modalId').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  $scope.clearForm = function() {
    $scope.setSelectedStation({});
    $scope.helper.formMode = 'Add';
  }

  $scope.loadStations = function() {
    stationFactory.getStations().then
    (
      function(successResponse) {
          $scope.stations = successResponse.data;
          console.log("stations loaded");
      },
      function(errorResponse) {
        console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
        $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
        $timeout($scope.resetAlert, 2000);
      }
    );
  }

  $scope.deleteStation = function() {
    console.log("Station zu löschen: " + $scope.selectedStation.Name);

    $scope.jQueryInjection();

    stationFactory.deleteStation($scope.selectedStation._id).then
    (
      function(successResponse) {
        console.log("successfully deleted");
        $scope.loadStations();
      },
      function(errorResponse) {
        console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
        $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
        $timeout($scope.resetAlert, 2000);
      }
    );

    $scope.setSelectedStation({});
  }

  $scope.editStation = function(s) {
    $scope.helper.formMode = 'Edit';
    $scope.setSelectedStation(s);
  }

  $scope.setSelectedStation = function(s) {
    $scope.selectedStation = {
      _id : s._id, 
      Name : s.Name, 
      Position : s.Position, 
      Grade : String(s.Grade), 
      Subject : s.Subject, 
      Description : s.Description
    };
  }

  $scope.stopEditing = function() {
    if($scope.helper.formMode == 'Add') {
      stationFactory.addStation($scope.selectedStation.Name, $scope.selectedStation.Grade, $scope.selectedStation.Subject, $scope.selectedStation.Description, $scope.selectedStation.Position).then
      (
        function(successResponse) {
          console.log("successfully added");
          $scope.loadStations();
          $scope.setSelectedStation({});

          $scope.addAlert('success', 'Info', 'Successfully added');
          $timeout($scope.resetAlert, 1500);
        },
        function(errorResponse) {
          console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
          $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
          $timeout($scope.resetAlert, 2000);
        }
      );
    }
    else {
      stationFactory.updateStation($scope.selectedStation._id, $scope.selectedStation.Name, $scope.selectedStation.Grade, $scope.selectedStation.Subject, $scope.selectedStation.Description, $scope.selectedStation.Position).then
      (
        function(successResponse) {
          console.log("station updated");
          $scope.loadStations();
          $scope.setSelectedStation({});

          $scope.addAlert('success', 'Info', 'Successfully updated');
          $timeout($scope.resetAlert, 1500);

          $scope.helper.formMode = 'Add';
        },
        function(errorResponse) {
          console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
          $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
          $timeout($scope.resetAlert, 2000);
        }
      );
    }
  }

  
});
})();