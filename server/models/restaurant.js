var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Restaurant = new Schema({
  company_profile: {
    name: {
      type: String
    },
    dining_style: String,
    cuisines: String,
    contact_person: {
      fullname: String,
      title: String
    },
    contact_information: {
      country: String,
      city: String,
      state_province_region: String,
      street_address: String,
      zip_code: String,
      country_code: String,
      phone_number: String,
      phone: String,
      website_address: String
    },
    options: {
      digital_menu: Boolean,
      graphic_design: Boolean,
      branding: Boolean,
      marketing: Boolean,
      photo_video: Boolean,
      web: Boolean
    }
  },
  seating: {
    number_tables: Number,
    table_layout: String
  },
  stripe_account: [{
    email: String,
    password: String
  }],
  opentable_account: [{
    email: String,
    password: String
  }],
  aboutus: {
    title: String,
    content: String
  }
});

module.exports = mongoose.model('Restaurant', Restaurant, 'restaurants');
