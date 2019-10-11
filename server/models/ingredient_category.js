var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngredientCategory = new Schema({
    company_id: {
        type: Schema.Types.ObjectId
    },
    user_id: {
        type: String,
        default: ''
    },
    createdbyAdmin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String
    },
    photo_url: {
        type: String
    },
    photo_name: {
        type: String
    },
    ingredients: [{
        type: Schema.Types.ObjectId,
        ref: 'Ingredient'
    }],
}, {
    usePushEach: true
});

module.exports = mongoose.model('IngredientCategory', IngredientCategory, 'ingredient_categories');