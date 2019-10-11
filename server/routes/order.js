var mongoose = require('mongoose');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var constants = require('../config/constants');
var moment = require('moment');
var Employee = require("../models/employee");
var Order = require("../models/order");
var OrderItem = require("../models/order_item");
const verifyToken = require("../lib/verifyToken");

/**
 *  order create
 */
router.post('/', async (req, res, next) => {

  try {
    // random order number
    var orderNo = Math.random().toString(36).substring(6);
    const { userId, tableNo, status } = req.body;
    const orderData = new Order({
      userId,
      tableNo,
      orderNo,
      status
    })
    // order save
    const newOrder = await orderData.save();

    const { name, customer_info, quantity, order = newOrder.id, total,
      food, drinks } = req.body;

    const orderItem = new OrderItem({
      name, customer_info, quantity, order, total, food, drinks
    })
    // order item save
    const newOrderItem = await orderItem.save();
    res.status(200).send({
      success: true,
      message: "Order create successfully!"
    })
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.toString()
    })
  }
})

/**
 *  order status accept & decline
 */
router.put('/', verifyToken, async (req, res, next) => {
  try {

    // find user
    var employees = await Employee.findOne({
      token: req.empToken
    });
    if (!employees) {
      return res.status(400).send({
        success: false,
        message: "Not found!"
      })
    }
    // employee role check kitchen&bar
    if (employees.role == 'kitchen') {
      const emp_info = { name: employees.firstname, email: employees.email, role: employees.role };
      const time = req.body.estimatedTime;
      req.body.kitchenUser = emp_info

      // status active
      if (req.body.status == "active") {
        req.body.orderAcceptedDate = new Date().toISOString();
        req.body.orderExpired = moment().add(time, 'minutes');
        var orderUpdate = await Order.findByIdAndUpdate({
          _id: req.body.order
        }, req.body, { new: true }).exec();
        res.status(200).send({
          success: true,
          data: 'Order status update successfully'
        })
      }
      // status decline
      else if (req.body.status == "decline") {
        var orderUpdate = await Order.findByIdAndUpdate({
          _id: req.body.order
        }, req.body, { new: true }).exec();
        res.status(200).send({
          success: true,
          data: 'Order status update successfully'
        })
      }
      // status ready
      else if (req.body.status == "ready") {
        req.body.orderExpired = null;
        var orderUpdate = await Order.findByIdAndUpdate({
          _id: req.body.order
        }, req.body, { new: true }).exec();
        res.status(200).send({
          success: true,
          data: 'Order status update successfully'
        })
      }

    }
    // employee role check waiter
    else if (employees.role == 'waiter') {
      const emp_info = { name: employees.firstname, email: employees.email, role: employees.role };
      const time = req.body.estimatedTime;
      req.body.waiterUser = emp_info
      // status serve
      if (req.body.status == "serve") {
        req.body.orderExpired = null;
        var orderUpdate = await Order.findByIdAndUpdate({
          _id: req.body.order
        }, req.body, { new: true }).exec();
        res.status(200).send({
          success: true,
          data: 'Order status update successfully'
        })
      }

    } else {
      res.status(200).send({
        success: true,
        data: 'Not permission to this order!'
      })
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.toString()
    })
  }
})

/**
 * Get  order
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    // find user
    var employees = await Employee.findOne({
      token: req.empToken
    });
    if (!employees) {
      res.status(200).send({
        success: true,
        data: 'Not found!'
      })
    }
    // User Role bar to get drinks
    if (employees.role == 'kitchen') {
      var orderData = await OrderItem.find().populate('order').select({ food: 1, name: 1, quantity: 1 });
      // User Role kitchen to get foods
    } else if (employees.role == 'bar') {
      var orderData = await OrderItem.find().populate('order').select({ drinks: 1, name: 1, quantity: 1 });
    }
    // User Role waiter to get order
    else if (employees.role == 'waiter') {
      var orderData = await OrderItem.find().populate('order');
    }
    // User Role guest to get order
    else if (employees.role == 'guest') {
      var orderobj = await Order.findOne({ userId: employees.user_id }).sort({ createdAt: -1 });
      var orderData = await OrderItem.find({ order: orderobj.id }).populate('order');
    }
    else {
      var orderData = 'No order found';
    }
    res.status(200).send({
      success: true,
      data: orderData
    })
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.toString()
    })
  }
})

module.exports = router;
