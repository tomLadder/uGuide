(function () {
angular.module('stationEdit', [])

.controller('stationEditCtrl', function ($rootScope, $scope, $location, $timeout, stationFactory, tdotFactory) {
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
    // $scope.setSelectedStation({});
    // $scope.helper.formMode = 'Add';

    alert($scope.selectedPosition);

    var tempPositionId = 0;
    $scope.mapTags.forEach(function(x) {
      if(x.Tag == $scope.selectedPosition)
        tempPositionId = x._id;
    });

    alert(tempPositionId);
  }

  $scope.loadPositions = function() {
    tdotFactory.getPositionTags().then
    (
        function(successResponse) {
            $scope.mapTags = successResponse.data;
            console.log("Positions loaded");
        },
        function(errorResponse) {
            console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
            $scope.addAlert('danger', errorResponse.data.code, errorResponse.data.error);
            $timeout($scope.resetAlert, 2000);
        }
    );
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
    // var tempTag = "";
    // $scope.mapTags.forEach(function(x) {
    //   if(x._id == s._id)
    //     tempTag = x.Tag;
    // });

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
        position._id = x._id;
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