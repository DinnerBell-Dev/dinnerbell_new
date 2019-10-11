var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Menu_customization = new Schema({
    user_id: {
        type: String,
        default: ''
    },
    ingredient_type: {
        type: String,
        default: 'Numeric'
    },
    ingredient_quantity: {
        type: Number,
        default: 1
    },
    spice_title: {
        type: String,
        default: ''
    },
    spice_number_options: {
        type: Number,
        default: 5
    },
    prefrences_title: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Menu_customization', Menu_customization, 'menu_customizations');