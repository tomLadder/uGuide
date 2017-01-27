(function () {
angular.module('stationEdit', [])

.controller('stationEditCtrl', function ($rootScope, $scope, $location, $timeout, stationFactory, tdotFactory, ViewConstant) {
  $scope.helper = {};
  $scope.selectedStation = {};
  $scope.selectedPosition;
  $scope.stations = [];

  $scope.mapTags = [];

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

    $scope.loadPositions();
  }

  $scope.jQueryInjection = function() {
    $('modalId').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  $scope.clearForm = function() {
    $scope.setSelectedStation({});
    $scope.helper.formMode = 'Add';
  }

  $scope.loadPositions = function() {
    tdotFactory.getPositionTags().then
    (
        function(successResponse) {
            $scope.mapTags = successResponse.data;
            console.log('INFO -- Positions loaded');
        },
        function(errorResponse) {
            console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
            $scope.addAlert('danger', errorResponse.data.code, 'Error occured while loading the map-positions');
            $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
        }
    );
  }

  $scope.loadStations = function() {
    stationFactory.getStations().then
    (
      function(successResponse) {
          $scope.stations = successResponse.data;
          console.log('INFO -- Stations loaded');
      },
      function(errorResponse) {
        console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
        $scope.addAlert('danger', errorResponse.data.code, 'Error occured while loading the stations');
        $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
      }
    );
  }

  $scope.deleteStation = function() {
    $scope.jQueryInjection();

    stationFactory.deleteStation($scope.selectedStation._id).then
    (
      function(successResponse) {
        console.log('INFO -- Successfully deleted');
        $scope.addAlert('warning', 'INFO', 'Successfully deleted a station');
        $scope.loadStations();
      },
      function(errorResponse) {
        console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
        $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
        $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
      }
    );

    $scope.setSelectedStation({});
  }

  $scope.editStation = function(s) {
    $scope.helper.formMode = 'Edit';
    $scope.setSelectedStation(s);
  }

  $scope.setSelectedStation = function(s) {
    $scope.selectedPosition = String(s.Position.Tag);

    $scope.selectedStation = {
      _id : s._id, 
      Name : s.Name, 
      Position : s.Position, 
      Grade : String(s.Grade), 
      Subject : s.Subject, 
      Description : s.Description
    };
  }

  $scope.setPositionId = function() {
    var position = {};
    $scope.mapTags.forEach(function(x) {
      if(x.Tag == $scope.selectedPosition) {
        position.id = x._id;
        position.X = x.X;
        position.Y = x.Y;
        position.Tag = x.Tag;
      }
    });

    $scope.selectedStation.Position = position;
  }

  $scope.stopEditing = function() {
    $scope.setPositionId();

    if($scope.helper.formMode == 'Add') {
      stationFactory.addStation($scope.selectedStation.Name, $scope.selectedStation.Grade, $scope.selectedStation.Subject, $scope.selectedStation.Description, $scope.selectedStation.Position).then
      (
        function(successResponse) {
          console.log('INFO -- Successfully added');
          $scope.loadStations();
          $scope.setSelectedStation({});

          $scope.addAlert('success', 'INFO', 'Successfully added');
          $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
        },
        function(errorResponse) {
          console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
          $scope.addAlert('danger', errorResponse.data.code, 'Error occured while adding a new station');
          $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
        }
      );
    }
    else {
      stationFactory.updateStation($scope.selectedStation._id, $scope.selectedStation.Name, $scope.selectedStation.Grade, $scope.selectedStation.Subject, $scope.selectedStation.Description, $scope.selectedStation.Position).then
      (
        function(successResponse) {
          console.log('INFO -- Station updated');
          $scope.loadStations();
          $scope.setSelectedStation({});

          $scope.addAlert('success', 'INFO', 'Successfully updated');
          $timeout($scope.resetAlert, ViewConstant.timeoutDuration);

          $scope.helper.formMode = 'Add';
        },
        function(errorResponse) {
          console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
          $scope.addAlert('danger', errorResponse.data.code, 'Error occured while updating the selected station');
          $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
        }
      );
    }
  }

  
});
})();