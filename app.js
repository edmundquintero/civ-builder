var express = require('express'),
    io = require('socket.io'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    crypto = require('crypto'),
    User = require('./models/user'),
    CivBuilderDb = require('./mongo').CivBuilderDb,
    IoListener = require('./socketio').IoListener;
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
passport.use(new LocalStrategy(
  function(username, password, done) {
    username = username.toLowerCase();
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/* 
 * Seed a User
 */

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

//Providers
var playerAPI = require('./providers/playerProvider');
var userAPI = require('./providers/userProvider');

// Routing
app.get('/', function(req, res) {
  res.redirect('/player');
});

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));
app.get('/login', function(req, res){
  res.render('login');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/profile', ensureAuthenticated, userAPI.get);

app.post('/player', playerAPI.post);
app.delete('/player', playerAPI.delete);
app.get('/player', playerAPI.list);


// Start Server
var server = app.listen(3001);
// Add Socket.io listener
var sio = new IoListener(server);

// Authentication utility middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if(req.user.role === 'admin'){ return next(); }
  res.redirect('/');
}