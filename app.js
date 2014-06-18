var express = require('express');
var CivBuilderDb = require('./static/js/mongo').CivBuilderDb;
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
app.use(express.methodOverride());

// start DB
var CivBuilderDb = new CivBuilderDb('localhost', 27017);

//Providers
var playerAPI = require('./static/js/providers/playerProvider');

// Routing
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/player', playerAPI.post);
app.delete('/player', playerAPI.delete)
app.get('/player', playerAPI.list);




// Start Server
app.listen(3001);