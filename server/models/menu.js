var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Menu = new Schema({
    // company_id: {
    //   type: Schema.Types.ObjectId
    // },
    // ingredients: [
    //   { type: Schema.Types.ObjectId, ref: 'Ingredient'}
    // ],
    // custom_options: {
    // },
    // questions: [{
    //   _id:false,
    //   question: String,
    //   answer: String
    // }],
    // details: {
    //   title: {
    //     type: String
    //   },
    //   description: {
    //     type: String
    //   },
    //   label: {
    //     type: Schema.Types.ObjectId, 
    //     ref: 'FoodLabel'
    //   },
    //   price: Number,
    //   photo_urls: [String]
    // },
    // categories: [{
    //   _id:false,
    //   mainmenu: {
    //     type: Schema.Types.ObjectId, 
    //     ref: 'MainMenu'
    //   },
    //   submenu: {
    //     type: Schema.Types.ObjectId, 
    //     ref: 'SubMenu'
    //   },
    // }]

    name: String,
    user_id: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: false
    },
    from_at: {
        type: String
    },
    to_at: {
        type: String
    },
    menu_type: String,
    photo_url: {
        type: String,
        default: ''
    },
    photo_name: {
        type: String,
        default: ''
    },
    subsection_switch: {
        type: String,
        default: 'false'
    },
    subsection: {
        type: Array,
        default: []
    },
    course: {
        type: Array,
        default: []
    },
    meal_price: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model('Menu', Menu, 'menus');