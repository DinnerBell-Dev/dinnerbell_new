var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
var constants = require('../config/constants');
var ReturnGuest = require('../models/return_guest')

var ObjectId = require('mongoose').Types.ObjectId; 
var pusher = new Pusher(constants.pusher);

router.post('/registerReturnGuest', function(req, res, next) {
  let newCustomer = new ReturnGuest()
  newCustomer.name = req.body.name
  newCustomer.email = req.body.email
  newCustomer.country_code = req.body.country_code
  newCustomer.phone_number = req.body.phone_number
  newCustomer.company_id = new ObjectId(req.body.company_id)
  
  ReturnGuest.findOne({$or: [{email: newCustomer.email}, {phone_number: newCustomer.phone_number}]}, function(err, customer){
      if (customer) {
        return res.json({success: false, error: constants.errors.user.duplicated_account})
      } else {
        newCustomer.save((err)=>{
          if (err) {
            return res.json({success: false, error: constants.errors.server_error})
          } else {
            return res.json({success: true, data:{}})
          }
        })
      }
  });
})

router.post('/getReturnGuest', function(req, res, next) {
  phone_number = req.body.phone_number
  country_code = req.body.country_code
  name = req.body.name
  ReturnGuest.findOne({$and: [{phone_number: phone_number}, {country_code: country_code}, {name: name}]}, function(err, customer){
    if (err) {
      return res.json({success: false, error: constants.errors.server_error})
    } else {
      if (!customer) {
        return res.json({success: false, error: constants.errors.user.user_not_found})
      } else {
        return res.json({success: true, data: {customer: customer}})
      }
    }
  });
});
module.exports = router;
