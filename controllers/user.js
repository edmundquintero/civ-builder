var User = require('../models/user.js');

exports.post = function(req, res){
  new User({name: req.body.name}).save(function(err, user){
    res.send(200, {user: user});
  });
};

exports.delete = function(req, res){
  User.findById(req.body.id, function(err, user) {
    user.remove(function(err, user){
      res.send(200, {user: user});
    });
  });
};

exports.get = function(req, res){
  User.findOne({ username: req.user.username }, function(err, user) {
    if(err){
      res.redirect('/login');
    } else {
      res.render('profile', { user: user });
    }
  });
};

exports.list = function(req, res){
   User.find({},function(err, users) {
    if(err){
      console.log("Failed to load user list.", err);
    }
    res.render('index', { users:users, user: req.user });
  });
};