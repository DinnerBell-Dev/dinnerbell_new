var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

/**
 * To create User's table with following fields.
 */
var UserSchema = new Schema({
    email: String,
    password: String,
    fullname: String,
    country: String,
    city: String,
    state: String,
    address: String,
    zipcode: String,
    website: String,
    countrycode: String,
    phone: String,
    businesstype: String,
    notes: String,
    companyname: String,
    occupation: String,
    cuisinesserved: String,
    digitalmenu: Boolean,
    graphicdesign: Boolean,
    branding: Boolean,
    marketting: Boolean,
    photovideo: Boolean,
    web: Boolean,
    lastlogin: Date,
    status: {
        type: String,
        default: 'Trail Plan'
    },
    createPasswordToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    weaklyRenewalSwitch:{
        type: String,
        default: 'false'
    },
    restaurantCode:{
        type: Number,
        default:12345678
    }
}, {
    timestamps: true
});

/**
 * To save or update encrypted password to user's table.
 */
UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

/**
 * For compare password to perform login functionality.
 */
UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema, 'users');