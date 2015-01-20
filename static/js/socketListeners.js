;

var socket = io.connect();

$('form#chatForm').on('submit', function(e){
  e.preventDefault();
  // console.log($('form#chatForm input[name=user]').val());
  socket.emit('newMessage', {
                  message:$(this).children('input[name=message]').val(),
                  user: $('form#chatForm input[name=user]').val()
                });
  $(this)[0].reset();
  $(this).children('input[name=message]').focus();
});

$('#newPeon').on('click', function(e){
  socket.emit('newPeon', {peon: 'frank'});
});

//--------------------------------------------------------------------------------

socket.on('newMessage', function(data){
  $('.chat-box').append('<p><strong>'+data.user+': </strong>'+data.message+'</p>');
});

socket.on('userLogoff', function(data){
  $('*[data-username="'+data.user.username+'"]').removeClass('online');
});

socket.on('userLogon', function(data){
  $('*[data-username="'+data.user.username+'"]').addClass('online');
});

socket.on('newPeon', function(data){
  var count = $('#peonCount').text();
  count++;
  $('#peonCount').text(count);
});