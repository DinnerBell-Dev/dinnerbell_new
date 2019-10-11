var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MainMenuSettings = new Schema({
    user_id: {
        type: String
    },
    background_image: String,
    menu_size: String,
    section_size: String,
});

module.exports = mongoose.model('MainMenuSettings', MainMenuSettings, 'mainmenusettings');