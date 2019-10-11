var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feedback = new Schema({
    user_id: {
        type: String
    },
    background_image: String,
    excellent_color: String,
    very_good_color: String,
    good_color: String,
    not_good_color: String,
    bad_color: String,
    margin_top: String
});

module.exports = mongoose.model('Feedback', Feedback, 'feedback');