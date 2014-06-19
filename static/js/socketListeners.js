;

var socket = io.connect();

if($('.player').length){
  socket.on('newPlayer', function(data){
  var template = '<div class="player '+data.player._id+'">'+
      '<div class="deletePlayer">'+
        '<form method="POST" action="/player">'+
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
}

$('form#newPlayer').on('submit', function(e){
  e.preventDefault();

  $.ajax({
    type: 'POST',
    url: '/player',
    data: { name: $('form#newPlayer input[name="name"]').val()},
    success: function(player, message){
      socket.emit('playerAdded', player);
    },
    dataType: 'json'
  });


});

$('.deletePlayer').on('submit', 'form', function(e){
  e.preventDefault();
  console.log($(this).children('input[name=name]').val());
});

