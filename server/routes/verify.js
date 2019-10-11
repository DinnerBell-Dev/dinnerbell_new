var config = require('../config/database');
var express = require('express');
var router = express.Router();
var phoneReg = require('../lib/phone_verification')(config.API_KEY);

/**
 * To send verification code to user's phone number via twillio.
 */
router.post('/start', function(req, res) {
    var phone_number = req.body.phone_number;
    var country_code = req.body.country_code;
    var via = req.body.via;

    if (phone_number && country_code && via) {
        phoneReg.requestPhoneVerification(phone_number, country_code, via, function(err, response) {
            if (err) {
                //console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                // console.log('Success register phone API call: ', response);
                res.status(200).json(response);
            }
        });
    } else {
        //console.log('Failed in Register Phone API Call', req.body);
        res.status(500).json({ error: "Missing fields" });
    }

});

/**
 * To verify code sent to user's contact number via twillio.
 */
router.post('/verify', function(req, res) {
    var country_code = req.body.country_code;
    var phone_number = req.body.phone_number;
    var token = req.body.token;

    if (phone_number && country_code && token) {
        phoneReg.verifyPhoneToken(phone_number, country_code, token, function(err, response) {
            if (err) {
                //console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                // console.log('Confirm phone success confirming code: ', response);
                if (response.success) {
                    res.status(200).json(response);
                }
            }

        });
    } else {
        // console.log('Failed in Confirm Phone request body: ', req.body);
        res.status(500).json({ error: "Missing fields" });
    }
});

module.exports = router;