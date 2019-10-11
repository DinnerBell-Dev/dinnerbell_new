var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
var constants = require('../config/constants');

var pusher = new Pusher(constants.pusher);

router.post('/sendServiceRequest', function(req, res, next) {
  let senderinfo = {
    'company_id': req.body.restaurant_id,
    'seatnumber': req.body.seatnumber,
    'service_type': req.body.service_type,
    'servicecontent': req.body.servicecontent,
  }
  let timelimit = constants.service.service_limit.common
  let receiverinfo = {
    'server_role': constants.employee_role.host
  }
  let senddata = {
    'senderinfo': senderinfo,
    'receiverinfo': receiverinfo
  }
  pusher.trigger('guest', 'sendServiceRequest', senddata);
  return res.json({success: true, data: {'timelimit': timelimit}});
});

router.post('/sendOrderRequest', function(req, res, next) {
  let senderinfo = {
    'username': req.body.username,
    'seatnumber': req.body.seatnumber,
    'service_type': req.body.servicename,
    'food': req.body.food_id
  }
  let receiverinfo = {

  }
  let senddata = {
    'senderinfo': senderinfo,
    'receiverinfo': receiverinfo
  }
  pusher.trigger('guest', 'sendOrderRequest', senddata);
  return res.json({success: true, data: {}});
});
module.exports = router;
