var io = require('socket.io');

IoListener = function(server) {

  var sio = io.listen(server);
  
  sio.sockets.on('connection', function(socket){

    // Add a player
    socket.on('playerAdded', function(player){
      socket.broadcast.emit('newPlayer', player);
      socket.emit('newPlayer', player);
    });

    //remove a player
    socket.on('playerRemoved', function(player){
      socket.broadcast.emit('playerRemoved', player);
      socket.emit('playerRemoved', player);
    });

    //temp Chat
    socket.on('newMessage', function(data){
      socket.broadcast.emit('newMessage', data);
      socket.emit('newMessage', data);
    });

    console.log("A socket connected!");
  });
};

exports.IoListener = IoListener;