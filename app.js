var express = require('express'),
    io = require('socket.io'),
    crypto = require('crypto'),
    User = require('./models/user'),
    passport = require('passport'),
    CivBuilderDb = require('./config/mongo').CivBuilderDb,
    IoListener = require('./config/socketio').IoListener,
    Utils = require('./config/utils');
// var methodOverride = require('method-override');

var app = express();

// include handelbars for templating
var hbs = require('hbs');

// Set static folder
app.use(express.static('static'));

// Set rendering engine
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
var passport = require('./config/passport');

/* 
 * Seed a User
 */

// var user = new User({ username: 'zygorf', email: 'edmundquintero@gmail.com', password: 'pass' });
// user.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + user.username + " saved.");
//   }
// });

// var user = new User({ username: 'indist1nct', email: 'jason.g.bibb@gmail.com', password: 'pass' });
// user.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + user.username + " saved.");
//   }
// });

// start DB
var CivBuilderDb = new CivBuilderDb('localhost', 27017);

// Start Server
var server = app.listen(3001);
// Add Socket.io listener
var sio = new IoListener(server);

// Controllers
var userAPI = require('./controllers/user');

// Routing
app.get('/', userAPI.list);

app.post('/login',  function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      user.logIn();
      sio.emit('userLogon', {user:user});
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/logout', Utils.ensureAuthenticated, function(req, res){
  User.findOne({ username: req.user.username }, function(err, user) {
    user.logOut();
    sio.emit('userLogoff', {user:user});
  });
  req.logout();
  res.redirect('/');
});

app.get('/profile', Utils.ensureAuthenticated, userAPI.get);
