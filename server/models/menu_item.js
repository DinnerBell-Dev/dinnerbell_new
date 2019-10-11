var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuItem = new Schema({
    user_id: {
        type: String,
        default: ''
    },
    menu_id: {
        type: String,
        default: ''
    },
    name: String,
    description: {
        type: String
    },
    status: {
        type: String,
        default: 'false'
    },
    label: String,
    item_type: String,
    photo_urls: String,
    photo_name: String,
    ingredientCustomTitle: String,
    menu_type: String,
    spice_options: {
        type: Array,
        default: []
    },
    questions: {
        type: Array,
        default: []
    },
    size_prize: {
        type: Array,
        default: []
    },
    ingredients: {
        type: Array,
        default: []
    },
    menus: {
        type: Array,
        default: []
    },

});

module.exports = mongoose.model('MenuItem', MenuItem, 'menuitem');