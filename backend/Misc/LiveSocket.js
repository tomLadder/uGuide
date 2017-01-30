var express         = require('express');
var http            = require('http').Server(express);
var io              = require('socket.io')(http);
var Tdot            = require('../Models/Tdot');

http.listen(3000, function(){
  console.log('Livesocket listening: ' + 3000);
});

io.on('connection', function(socket){
    console.log('a user connected');

    Tdot.findOne({IsCurrent: true}, "Map Points",  function(err, tdot) {
        socket.emit('initPaket', tdot);
    });
});

exports.sendNotification = function(notification) {
    io.sockets.emit('notification', notification);
}

exports.sendGuideEntered = function(guideid) {
    io.sockets.emit('guideEntered', { Guide: guideid });
}

exports.sendGuideLeft = function(guideid) {
    ios.sockets.emit('guideLeft', { Guide: guideid });
};