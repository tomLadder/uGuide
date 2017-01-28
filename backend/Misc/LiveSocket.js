var express         = require('express');
var http            = require('http').Server(express);
var io              = require('socket.io')(http);

http.listen(3000, function(){
  console.log('Livesocket listening: ' + 3000);
});

io.on('connection', function(socket){
    console.log('a user connected');
});

exports.sendNotification = function(notification) {
    io.sockets.emit('notification', notification);
}