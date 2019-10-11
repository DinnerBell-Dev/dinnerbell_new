var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Label = new Schema({
    name: String
});

module.exports = mongoose.model('Label', Label, 'labels');