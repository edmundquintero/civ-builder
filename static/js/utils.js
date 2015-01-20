
/**
accepts string id of content area to open
**/

function openPlayerMenuContent(content){
  var content = (content[0] === '#') ? content : '#' + content;
  if( !$(content).is(':visible') ) {
    $('.left-bar-content-area').hide();
    $(content).show();
    return true;
  }
  return false;
}

$('#player-menu').on('click', 'li', function(e){

  if( !$(this).hasClass('active') ){
    $('#player-menu li').removeClass('active');
    $(this).addClass('active');
  }

  if( openPlayerMenuContent( this.getAttribute('data-target') ) ){
    if( $('.left-bar').hasClass('closed') ){
      $('.left-bar').removeClass('closed');
    }
  } else {
    $('.left-bar').toggleClass('closed');
  }
});





var peons = [];
var foodcount = 0;

var Peon = function(params){
  params = ( typeof params == 'object') ? params : {};
  this.name = params.name || 'unknown';
  this.gather = params.gather || 1;
  this.job = params.job || 'unassigned';
  this.startJob = function(job){
    if( this.job === 'forage' ){
      forage(this);
    }
  };
}


$('#newPeon').on('click', function(e){
  if( foodcount >= 25 ){
    removeFood(25);
    var frank = new Peon({job: 'forage'});
    peons.push(frank);
    frank.startJob();
    console.log(peons);
  }
});





var setFood = function(newfood){
  foodcount += newfood;
  $('#foodcount').text(foodcount);
};

var addFood = function(newfood){
  foodcount += newfood;
  $('#foodcount').text(foodcount);
};

var removeFood = function(oldfood){
  foodcount -= oldfood;
  $('#foodcount').text(foodcount);
}



var forage = function(peon){
  window.setInterval(function(){
    setFood(peon.gather);
  }, 3000);
};

(function init(){
  setFood(50);
})();
