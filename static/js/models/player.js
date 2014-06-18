var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var playerSchema = new Schema({name: String});

module.exports = mongoose.model('Player', playerSchema);
