var io = require('socket.io');

IoListener = function(server) {

  var sio = io.listen(server);
  
  sio.sockets.on('connection', function(socket){
    //temp Chat
    socket.on('newMessage', function(data){
      socket.broadcast.emit('newMessage', data);
      socket.emit('newMessage', data);
    });

    console.log("A socket connected!");
  });
  return sio;
};

exports.IoListener = IoListener;