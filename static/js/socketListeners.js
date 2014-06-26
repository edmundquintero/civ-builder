;

var socket = io.connect();

if($('.player').length){

  socket.on('newPlayer', function(data){
    var template = '<div class="player '+data.player._id+'">'+
        '<div class="deletePlayer">'+
          '<form>'+
            '<input type="hidden" name="_method" value="delete">'+
            '<input type="hidden" name="id" value="'+ data.player._id +'">'+
            '<button type="submit"> X </button>'+
          '</form>'+
        '</div>'+
        '<div class="playerName">'+
          '<strong>Name:</strong> '+ data.player.name +
        '</div>'+
      '</div>';
    $('.playerContainer').append(template);
  });

  socket.on('playerRemoved', function(data){
    $('.playerContainer .player.'+data.player._id).hide().remove();
  });

}

$('form#newPlayer').on('submit', function(e){
  e.preventDefault();
  var form = $(this);
  $.ajax({
    type: 'POST',
    url: '/player',
    data: { name: $('form#newPlayer input[name="name"]').val()},
    success: function(player, message){
      socket.emit('playerAdded', player);
      form[0].reset();
    },
    dataType: 'json'
  });
});

$('.playerContainer').on('submit', 'form', function(e){
  e.preventDefault();
  // console.log($(this).children('input[name=id]').val());

  $.ajax({
    type: 'DELETE',
    url: '/player',
    data: { id: $(this).children('input[name=id]').val() },
    success: function(player, message){
      socket.emit('playerRemoved', player);
    },
    dataType: 'json'
  });

});


$('form#chatForm').on('submit', function(e){
  e.preventDefault();
  socket.emit('newMessage', {
                  message:$(this).children('input[name=message]').val(),
                  user: $(this).children('input[name=user]').val()
                });
  $(this)[0].reset();
  $(this).children('input[name=message]').focus();
});

socket.on('newMessage', function(data){
  $('.chat-box').append('<p><strong>'+data.user+': </strong>'+data.message+'</p>');
});
