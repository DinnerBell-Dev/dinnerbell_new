var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReturnGuest = new Schema({
  company_id: {
    type: Schema.Types.ObjectId
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  country_code: {
    type: String
  },
  phone_number: {
    type: String
  }
});

module.exports = mongoose.model('ReturnGuest', ReturnGuest, 'return_guests');
