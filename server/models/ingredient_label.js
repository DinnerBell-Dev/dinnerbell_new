var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngredientLabel = new Schema({
    company_id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    color: {
        type: String
    }
}, {
    usePushEach: true
});

module.exports = mongoose.model('IngredientLabel', IngredientLabel, 'ingredient_labels');