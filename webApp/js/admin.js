(function () {
angular.module('admin', [])

.controller('adminCtrl', function ($scope, $sce, stationFactory) {

  $scope.stationPanels = [];

  $scope.init = function() {
      stationFactory.getQRs().then
      (
        function(successResponseQR) {
          for(var i=0;i<successResponseQR.data.length;i++) {
            console.log(successResponseQR.data[i].name);
            $scope.stationPanels.push({"name": successResponseQR.data[i].name, "qr": successResponseQR.data[i].qr});
          }
        },
        function(errorResponseQR) {
          console.log('Error - ' + errorResponseQR.status + ' ' + errorResponseQR.data.message);
        }
      );
  }
});
})();
