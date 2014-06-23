var mongoose = require('mongoose');

CivBuilderDb = function(host, port) {
  // var db = mongoose.createConnection(host, 'civbuilder-db', port);
  var db = mongoose.connect('mongodb://localhost/civbuilder-db');

};

exports.CivBuilderDb = CivBuilderDb;