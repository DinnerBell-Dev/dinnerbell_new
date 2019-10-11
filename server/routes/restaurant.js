var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var constants = require('../config/constants');
var moment = require('moment');
//var utils = require('../utils/utils')
var utils = require('nnjson')
// Mongodb schemas
var ObjectId = require('mongoose').Types.ObjectId;
var User = require("../models/user");
var Employee = require("../models/employee");
var FoodLabel = require("../models/food_label");
var IngredientCategory = require("../models/ingredient_category");
var IngredientLabel = require("../models/ingredient_label");
var Ingredient = require("../models/ingredient");
var MainMenu = require("../models/main_menu");
var Menu = require("../models/menu");
var PrixFixe = require("../models/prix_fixe");
var Restaurant = require("../models/restaurant");
var SubMenu = require("../models/sub_menu");
var Theme = require("../models/theme");
var DailySpecial = require("../models/dailyspecial");
var UpcomingEvent = require("../models/upcoming_event");
var MailingList = require("../models/mailing_list");

var dateFormat = require('dateformat');
router.post('/getInitData', function (req, res) {
  let company_id = req.body.restaurant_id
  let data = {}
  let employees = Employee.find({ company_id: new ObjectId(company_id) }).select('-__v -company_id').exec();

  let themes = Theme.find({ company_id: new ObjectId(company_id) }).select('-__v -company_id').exec();
  // themes.then(function(themes_data){
  //   data.themes = themes_data
  //   for (let i = 0; i < themes_data.length; i++) {
  //     data.themes[i].logo_url = req.getUrl + 'restaurant_photos/' + data.themes[i].logo_url
  //     data.themes[i].background_url = req.getUrl + 'restaurant_photos/' + data.themes[i].background_url
  //   };
  // })
  let restaurants = Restaurant.findOne({ _id: new ObjectId(company_id) }).select('-__v -company_id -aboutus').exec();
  // restaurants.then(function(restaurants_data){
  //   data.restaurants = restaurants_data
  // })
  let main_menu = MainMenu.find({ company_id: new ObjectId(company_id) }).select('-__v -company_id').exec();
  let sub_menu = SubMenu.find({ company_id: new ObjectId(company_id) }).select('-__v -company_id').exec();
  let menu = Menu.find({ company_id: new ObjectId(company_id) }).select('-__v -company_id -categories').populate([{ path: 'details.label', select: '-__v -company_id' }, { path: 'ingredients', select: '-__v -company_id', populate: { path: 'label', select: '-__v -company_id' } }]).exec();
  // let menus = MainMenu.find({company_id: new ObjectId(company_id) }).select('-__v -company_id')
  //   // .populate('submenus','-__v -company_id')
  //   // .populate('menus','-__v -company_id')
  //   .populate({path:'submenus',select:'-__v -company_id',
  //    populate: {path:'menus',select:'-__v -company_id'
  //    ,populate: [{path:'details.label',select:'-__v -company_id'}, {path:'ingredients',select:'-__v -company_id',populate: {path:'label',select:'-__v -company_id'}}]
  //   }}).sort({from_at:1})
  //   .exec();
  // menus.then(function(menus_data){
  //   data.menus = menus_data
  // })
  Promise.all([employees, themes, restaurants, main_menu, sub_menu, menu]).then(function (values) {
    data.employees = values[0]
    data.themes = values[1]
    for (let i = 0; i < data.themes.length; i++) {
      data.themes[i].logo_url = `${constants.base_url}/theme_photos/${data.themes[i].logo_url}`
      data.themes[i].welcome_photo_url = `${constants.base_url}/theme_photos/${data.themes[i].welcome_photo_url}`
      for (let j = 0; j < data.themes[i].background_urls.length; j++) {
        data.themes[i].background_urls[j] = `${constants.base_url}/theme_photos/${data.themes[i].background_urls[j]}`
      }
      data.themes[i].video.video_url = `${constants.base_url}/theme_photos/${data.themes[i].video.video_url}`
    }
    data.restaurants = values[2]
    data.main_menu = values[3]
    data.sub_menu = values[4]
    data.menu = JSON.parse(JSON.stringify(values[5]))
    for (let i = 0; i < data.menu.length; i++) {
      for (let j = 0; j < data.menu[i].details.photo_urls.length; j++) {
        data.menu[i].details.photo_urls[j] = `${constants.base_url}/food_photos/${data.menu[i].details.photo_urls[j]}`
      }
      for (let j = 0; j < data.menu[i].ingredients.length; j++) {
        const photo_url = `${constants.base_url}/ingredient_photos/${data.menu[i].ingredients[j].photo_url}`
        data.menu[i].ingredients[j].photo_url = photo_url
      }
      // menu.ingredients.forEach(function(element, index, urlArray) {
      //   let photourl = element.photo_url
      //   element.photo_url = `${constants.base_url}/ingredient_photos/`+photourl
      // });
    }
    // return res.json({success: true, data: JSON.parse(utils.removeNull(data))});
    return res.json({ success: true, data: utils.removeNull(data) });
  }).catch(reason => {
    console.log(reason)
    return res.json({ success: false, error: constants.errors.server_error });
  });;
  //return res.json({success: true, data:data});
});

/**
 *  order create
 */
// router.post('/order', async function (req, res, next) {
//   let neworder = {
//     company_id: req.body.restaurant_id,
//     server_id: req.body.server_id,
//     table_number: req.body.table_number,
//     customer_info: req.body.customer_info,
//     order_details: req.body.order_details,
//     order_date: new Date(),
//     order_status: constants.order_status.pending
//   }
//   let order = new Order(neworder)
//   order.save((err) => {
//     if (err) {
//       return res.json({success:false, error: constants.errors.server_error})
//     } else {
//       return res.json({success:true, data: {}})
//     }
//   })
// })


router.post('/requestDrink', function (req, res) {

  let restaurant_id = req.body.restaurant_id
  return res.json({ success: true, data: {} })
})
router.post('/aboutus', function (req, res) {
  let restaurant_id = req.body.restaurant_id
  Restaurant.findById(restaurant_id, function (err, restaurant) {
    if (err) {
      return res.json({ success: false, error: constants.errors.server_error })
    } else {
      if (!restaurant) {
        return res.json({ success: false, error: constants.errors.not_found })
      } else {
        return res.json({ success: true, data: { aboutus: restaurant.aboutus } })
      }
    }
  })
})
router.post('/upcoming_events', function (req, res) {
  let restaurant_id = req.body.restaurant_id
  UpcomingEvent.find({ company_id: new ObjectId(restaurant_id) }, function (err, upcoming_events) {
    let result = JSON.parse(JSON.stringify(upcoming_events))
    for (var index = 0; index < result.length; index++) {
      // Basic usage
      let newdate = dateFormat(result[index].event_date, "yyyy-mm-dd");
      result[index].event_date = newdate
    }
    if (err) {
      return res.json({ success: false, error: constants.errors.server_error })
    } else {
      if (!upcoming_events) {
        return res.json({ success: false, error: constants.errors.not_found })
      } else {
        return res.json({ success: true, data: { upcoming_events: result } })
      }
    }
  })
})
// register email to mailinglist
router.post('/mail_subscribe', function (req, res) {
  let company_id = req.body.restaurant_id
  let email = req.body.email
  let name = req.body.name
  MailingList.findOne({ email: email }, function (err, existmail) {
    if (err) {
      return res.json({ success: false, error: constants.errors.server_error })
    }
    if (!existmail) {
      let newMail = new MailingList()
      newMail.email = email
      newMail.name = name
      newMail.company_id = company_id
      newMail.save((err) => {
        if (err) {
          return res.json({ success: false, error: constants.errors.server_error })
        } else {
          return res.json({ success: true, data: { new_subscribe: newMail } })
        }
      })
    } else {
      return res.json({ success: false, error: constants.errors.user.duplicated_email })
    }
  })
})
router.get('/test', function (req, res) {
  var user = {
    name: 'Nomura Nori',
    age: '36',
    school_id: null,
    posts: [{
      title: 'node package',
      content: 'you can remove null fields in json object using nnjson',
      photo_id: 123,
    }, {
      title: 'node package',
      content: 'you can remove null fields in json object using nnjson',
      photo_id: null,
    },
    ]
  }
  return res.json({ success: true, data: utils.removeNull(user) });
})

router.post('/getDailySpecials', function (req, res) {
  let company_id = req.body.restaurant_id
  var start = new Date(1992, 9, 1);
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);
  DailySpecial.findOne({ $and: [{ company_id: company_id }, { today: { $gte: start, $lt: end } }] }).select('menus').exec(function (err, doc) {
    if (err) {
      return res.json({ success: false, error: constants.errors.server_error })
    } else {
      if (!doc) {
        return res.json({ success: true, data: { menus: [] } })
      } else {
        return res.json({ success: true, data: { menus: doc.menus } })
      }
    }
  })
})

router.post('/getPrixFixe', function (req, res) {
  let company_id = req.body.restaurant_id
  PrixFixe.findOne({ company_id: company_id }).select('menus').exec(function (err, doc) {
    if (err) {
      return res.json({ success: false, error: constants.errors.server_error })
    } else {
      if (!doc) {
        return res.json({ success: true, data: { menus: [] } })
      } else {
        return res.json({ success: true, data: { menus: doc.menus } })
      }
    }
  })
})

router.post('/leaveFeedback', function (req, res) {
  var newfeedback = {
    company_id: req.body.restaurant_id,
    server_id: req.body.server_id,
    service_rating: req.body.service_rating,
    food_rating: req.body.food_rating,
    comment: req.body.comment
  }
  return res.json({ success: true, data: {} });
})
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
