var mongoose = require('mongoose');

mongoose.connect('mongodb://jennki:jennki@ds045988.mongolab.com:45988/dreamt');

mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var DreamSchema = new mongoose.Schema({
  item: {type: String, default: '', lowercase: true},
  meaning: {type: Array},
  source: {type: String, default: '', lowercase: true}
});

module.exports = mongoose.model('dreams', DreamSchema);