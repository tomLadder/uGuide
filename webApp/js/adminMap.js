(function () {
var app = angular.module('adminMap', ['canvasLib']);

app.directive('backImg', function() {
    return function(scope, element, attrs) {

        attrs.$observe('backImg',  function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : '100% 100%'
            });
        });
    };
});

app.controller('adminMapCtrl', function ($rootScope, $scope, $timeout, stationFactory, tdotFactory, canvasLibFactory, ViewConstant) {
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

        $scope.getStations();

        $scope.getCurrentTdot();
    }

    $scope.jQueryInjection = function() {
        //JQuery injection möööö
        $('modalId').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    $scope.getStations = function() {
        stationFactory.getStationsWithPosition().then
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

    $scope.getCurrentTdot = function() {
        tdotFactory.getCurrentTdot().then
        (
            function(successResponse) {
                $scope.currentTdot = successResponse.data;

                tdotFactory.getMap($scope.currentTdot._id).then
                (
                    function(successResponse) {
                        parseMapFromServer(successResponse.data);
                    },
                    function(errorResponse) {
                        console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
                        $scope.addAlert('danger', errorResponse.data.code, "Failed to get map");
                        $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
                    }              
                );

            },
            function(errorResponse) {
                console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, 'Error occured while loading the current TdoT');
                $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
            }
        );
    }

    //MAP - Editor
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    
    $scope.currentPoint = undefined;
    $scope.data = [
    ];

    function resetHoverPoints() {
        for (var i = 0; i < $scope.data.length; i++) {
            $scope.data[i].isHover = false;
        }
    }

    function getPoint(x, y) {
        for (var i = 0; i < $scope.data.length; i++) {
            if(isPointInCircle(x, y, $scope.data[i].x, $scope.data[i].y, $scope.data[i].amount)) {
                return $scope.data[i];
            }
        }
    }

    function parseMapFromServer(mapData) {
        $scope.base64Image = mapData.Map;
        
        var points = mapData.Points.map(function(point) {
            return { tag: point.Tag, x: point.X, y: point.Y, amount: 10, isCurrent: false, isHover: true };
        });

        $scope.data = points;
        redraw();
    }

    function isPointInCircle(x, y, xCircle, yCircle, radius) {
        return Math.sqrt((x-xCircle)*(x-xCircle) + (y-yCircle)*(y-yCircle)) < radius;
    }

    function redraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < $scope.data.length; i++) {
            if($scope.data[i].isCurrent) {
                canvasLibFactory.drawDot(context, $scope.data[i], "#FF0000");
                canvasLibFactory.drawToolTip(context, $scope.data[i]);
            } else if($scope.data[i].isHover) {
                canvasLibFactory.drawDot(context, $scope.data[i], "#FFC107");
                canvasLibFactory.drawToolTip(context, $scope.data[i]);
            } else {
                canvasLibFactory.drawDot(context, $scope.data[i], "#ccddff");
            }
        }
     }

    // setup
    canvas.width = 800;
    canvas.height = 600;
    context.globalAlpha = 1.0;
    context.font = "25px serif";
    context.beginPath();
    redraw();   
});
})();