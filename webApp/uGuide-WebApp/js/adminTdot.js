(function () {
var app = angular.module('adminTdot', ['canvasLib', 'ngFileUpload']);

app.directive('backImg', function() {
    return function(scope, element, attrs) {

        attrs.$observe('backImg',  function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});

app.controller('adminTdotCtrl', function ($rootScope, $scope, $timeout, Upload, tdotFactory, canvasLibFactory) {
    $scope.tdots = [];
    $scope.currentTdot = {};
    $scope.newTdot = {};
    $scope.nextTdots = [];

    $scope.alert = {};
    $scope.base64Image = "";

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

                tdotFactory.getMap($scope.currentTdot._id).then
                (
                    function(successResponse) {
                        parseMapFromServer(successResponse.data);
                    },
                    function(errorResponse) {
                        console.log('Error - ' + errorResponse.status + ' ' + errorResponse.data.message);
                        $scope.addAlert('danger', errorResponse.data.code, "Failed to get map");
                        $timeout($scope.resetAlert, 2000);
                    }              
                );

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
    }

    $scope.removeLockInfo = function() {
        $scope.resetAlert();
    }

    $scope.saveMap = function() {
        var points = convertToServerPoints();
        var mapdata = { Map: $scope.base64Image, Points: points };

        tdotFactory.saveMap($scope.currentTdot._id, mapdata).then
        (
            function(successResponse) {
                $scope.addAlert('success', successResponse.status, "Map saved");
                $timeout($scope.resetAlert, 2000);               
            },
            function(errorResponse) {
                $scope.addAlert('danger', errorResponse.data.code, "Could not save map");
                $timeout($scope.resetAlert, 2000);
            }
        );
    }

    //MAP - Editor
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    
    $scope.currentPoint = undefined;
    $scope.data = [
    ];

    $scope.removePoint = function(point) {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].tag === point.tag) {
                $scope.data.splice(i, 1);
            }
        }

        context.clearRect(0, 0, 600, 400);
        redraw();

        $scope.addAlert('success', "Info", "Point removed");
        $timeout($scope.resetAlert, 2500);
    }


    $scope.canvasClicked = function(event) {
        if($scope.currentPoint != undefined) {
            $scope.currentPoint.isCurrent = false;
            $scope.currentPoint = undefined;

            redraw();
        } else {
            point = getPoint(event.offsetX, event.offsetY);
            if(point != undefined) {
                $scope.currentPoint = point;
                $scope.currentPoint.isCurrent = true;
            }
        }
    }

    $scope.onMove = function(event) {
        if($scope.currentPoint != undefined) {
            $scope.currentPoint.x = event.offsetX;
            $scope.currentPoint.y = event.offsetY;

            redraw();
        } else {
            resetHoverPoints();

            point = getPoint(event.offsetX, event.offsetY);      
            if(point != undefined) {
                point.isHover = true;
            }   

            redraw(); 
        }
    }

    $scope.addPoint = function() {
        if($scope.data.some(function(data, index, array) {
            return data.tag == $scope.tag;
        }) == true) {
            $scope.addAlert('danger', "Error", "Tag already defined");
            $timeout($scope.resetAlert, 2500);
        } else {
            var p = {
                tag: $scope.tag,
                x: 10,
                y: 10,
                amount: 10,
                isCurrent: true,
                isHover: false
            };

            $scope.data.push(p);
            $scope.currentPoint = p;

            redraw();
        }
    }

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

    function convertToServerPoints() {
        var points = $scope.data.map(function(point) {
            return { Tag: point.tag, X: point.x, Y: point.y };
        });

        return points;
    }

    function parseMapFromServer(mapData) {
        $scope.base64Image = mapData.Map;
        
        var points = mapData.Points.map(function(point) {
            return { tag: point.Tag, x: point.X, y: point.Y, amount: 10, isCurrent: false, isHover: false };
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

    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            Upload.base64DataUrl(file).then(function(url) {
                $scope.base64Image = url;
            });
        }   
    }  
});
})();