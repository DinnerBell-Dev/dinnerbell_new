var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Intro = new Schema({
    user_id: {
        type: String
    },
    static_image: String,
    slide_image1: String,
    slide_image1: String,
    slideShow: {
        type: Array,
        default: []
    },
    videoInto: String,
});

module.exports = mongoose.model('Intro', Intro, 'intros');