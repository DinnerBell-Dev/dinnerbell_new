var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuItems = new Schema({
    user_id: {
        type: String
    },
    background_image: String,
    sectionHeader_size: String,
    subSection_size: String,
    itemTitle_size: String,
});

module.exports = mongoose.model('MenuItems', MenuItems, 'menuitems');