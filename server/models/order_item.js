var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderItem = new Schema({
  order: { type: Schema.ObjectId, ref: 'Order' },
  name: {
    type: String,
  },
  customer_info: {
    name: String,
    email: String,
    phone: Number,
  },
  quantity: {
    type: Number
  },
  total: {
    type: Number
  },
  food:{
    size_prize: {
      price: Number,
      calories: String,
      weight: String,
      portion_size: String
    },
    spice_options: {
      type: String,
    },
    temperature: {
      type: String
    },
    questions: {
      type: Array,
      default: []
    },
    ingredients: {
      type: Array,
      default: []
    },
   },
  drinks:
  {
    water:String
  }
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Orderitem', OrderItem);
