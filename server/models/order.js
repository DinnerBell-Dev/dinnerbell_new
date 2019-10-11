var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var Order = new Schema({
//   company_id: {
//     type: Schema.Types.ObjectId
//   },
//   server_id: {
//     type: Schema.Types.ObjectId
//   },
//   table_number: String,
//   customer_info: {
//     name: String,
//     email: String,
//   },
//   order_details: {
//     menus: [{
//       menu: {},
//       price: String,
//       count: String
//     }],
//     total_price: String
//   },
//   order_date: String,
//   order_status: String,
//   checkout_date: String
// });

var Order = new Schema({
  userId: { type: Schema.ObjectId, ref: 'User' },
  orderNo: {
    type: String,
  },
  tableNo: {
    type: Number,
  },
  status: {
    type: String,
  },
  reason: {
    type: String,
  },
  kitchenUser: {
    name: String,
    email: String,
    role: String
  },
  waiterUser: {
    name: String,
    email: String,
    role: String
  },
  estimatedTime: Number,
  orderAcceptedDate: Date,
  orderExpired: Date,
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', Order);
