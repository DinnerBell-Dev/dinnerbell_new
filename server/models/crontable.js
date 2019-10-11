var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CronTable = new Schema({
    user_id: {
        type: String
    },
    weaklyRenewalSwitch: String,
    fullname: String,
    occupation: String,
    companyname: String,
    address: String,
    fullname: String,
    fullname: String,
    countrycode: String,
    phone: String,
});

module.exports = mongoose.model('CronTable', CronTable, 'crontables');