var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Ingredient = new Schema({
    company_id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    label: String,
    price: {
        type: Number,
        default: 0
    },
    // label: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'IngredientLabel'
    // },
    photo_url: {
        type: String
    },
    photo_name: {
        type: String
    }
}, {
    usePushEach: true
});

module.exports = mongoose.model('Ingredient', Ingredient, 'ingredients');