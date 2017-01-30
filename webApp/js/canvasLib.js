(function() {
    var canvasLib = angular.module('canvasLib', []);


    canvasLib.factory('canvasLibFactory', function() {
        var factory = {};

        factory.test = function() {
            console.log('test');
        }

        factory.drawDot = function (context, data, color) {
            context.beginPath();
            context.arc(data.x, data.y, data.amount, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = "#666666";
            context.stroke();
        }

        factory.drawLine = function(context, point1, point2) {
            context.beginPath();
            context.moveTo(point1.x, point1.y);
            context.lineTo(point2.x, point2.y);
            context.strokeStyle = "black";
            context.stroke();
        }

        factory.drawToolTip = function(context, point) {
            var x = point.x;
            var y = point.y - 30;
            var height = 25;

            context.textAlign = "center";
            width = context.measureText(point.tag).width + 20;

            factory.drawRectFilled(context, x - width/2, y - height/2, width, height, "white");
            factory.drawRect(context, x - width/2, y - height/2, width, height, "black  ");

            context.fillStyle = "black";
            context.fillText(point.tag, x, y + height / 4);
        }

        factory.drawRectFilled = function(context, x, y, w, h, color) {
            context.fillStyle = color;
            context.fillRect(x, y, w, h);
        }

        factory.drawRect = function(context, x, y, w, h, color) {
            context.fillStyle = color;
            context.rect(x, y, w, h);
            context.stroke();
        }

        return factory;
    });
})();