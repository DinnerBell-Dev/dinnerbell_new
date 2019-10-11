var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Employee = new Schema({
    user_id: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    role: {
        type: String
    },
    email: {
        type: String
    },
    countrycode: {
        type: String
    },
    phone: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    zipcode: {
        type: String
    },
    streetAddress: {
        type: String
    },
    qrfileid: {
        type: String,
        default: ''
    },
    token:{
        type: Number,
        default:1234
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', Employee, 'employees');