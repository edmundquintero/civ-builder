var Player = require('../models/player.js');

exports.post = function(req, res){
  new Player({name: req.body.name}).save(function(err, player){
    res.send(200, {player: player});
  });
};

exports.delete = function(req, res){
  Player.findById(req.body.id, function(err, player) {
    player.remove(function(err, player){});
  });
  res.redirect('/player');
};

exports.get = function(req, res){
  Player.findById(req.body.id, function(err, player) {
    res.render('index', { player: player });
  });
  res.redirect('/player');
};

exports.list = function(req, res){
   Player.find({},function(err, players) {

    res.render('playerList', { players:players });
  });
};