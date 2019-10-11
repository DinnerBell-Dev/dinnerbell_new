var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Base = new Schema({
    user_id: String,
    base_theme: String,
    font_set: String,
    header_color: String,
    sub_header_color: String,
    body_color: String,
    nav_bar_color: String,
    select_highlight_color: String,
    goback_color: String,
    ui_neutral_color: String,
    alert_color: String,
    currency: String,
    price_format: String
});

module.exports = mongoose.model('Base', Base, 'base');