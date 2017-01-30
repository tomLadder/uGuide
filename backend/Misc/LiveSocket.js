var express         = require('express');
var http            = require('http').Server(express);
var io              = require('socket.io')(http);
var Tdot            = require('../Models/Tdot');
var Notification    = require('../Models/Notification');
var moment          = require('moment');

http.listen(3000, function(){
  console.log('Livesocket listening: ' + 3000);
});

io.on('connection', function(socket){
    console.log('a user connected');

    Tdot.findOne({IsCurrent: true}, "Map Points",  function(err, tdot) {
        getCurrentGuides(tdot, function(guides) {
            console.log(guides);

            socket.emit('initPaket', { Tdot: tdot, Guides: guides });
        });
        socket.emit('initPaket', tdot);
    });
});

function getCurrentGuides(tdot, callback) {
    var cutoff = moment(new Date()).subtract(20, 'minutes').toDate();

    Notification.aggregate( [
            {
                $match: {
                    Time: {$gte: cutoff},
                    Tdot: tdot._id
                }
            },
            {
                $sort: { Guide: 1, Time: -1 }
            },
            { 
                $group: {
                    "_id": "$Guide",
                    "Name": { "$first": "$Name" },
                    "Position": {"$first": "$Position"}
                }
            }
        ], function(err, guides) {
            if(err) {
                callback([]);
            }

            callback(guides);
        });
}

exports.sendNotification = function(notification) {
    io.sockets.emit('notification', notification);
}

exports.sendGuideEntered = function(guideid) {
    io.sockets.emit('guideEntered', { Guide: guideid });
}

exports.sendGuideLeft = function(guideid) {
    ios.sockets.emit('guideLeft', { Guide: guideid });
};