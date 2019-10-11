var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../../config/database');
var express = require('express');
var Restaurant = require("../../models/restaurant");
var ObjectId = require('mongoose').Types.ObjectId; 
var User = require("../../models/user");
var constants = require('../../config/constants');
var router = express.Router();
const authy = require('authy')(constants.twilio.authyKey);
var mailgun = require('mailgun-js')({apiKey: constants.mailgun.api_key, domain: constants.mailgun.DOMAIN});

router.post('/sendAuthyToken', function(req, res) {

    let authyId = req.body.authyId
    let email = req.body.email
    let countryCode = req.body.country_code
    let phone = req.body.phone
    
    if (authyId == -1) {
        // Register this user if it's a new user
        authy.register_user(email, phone, countryCode,
            function(err, response) {
            if (err || !response.user) {
                return res.json({success: false, error:constants.errors.invalid_params});
            };
            let authyId = response.user.id;
            sendToken(authyId);
        });
    } else {
        // Otherwise send token to a known user
        sendToken(authyId);
    }

    // With a valid Authy ID, send the 2FA token for this user
    function sendToken(authyId) {

        authy.request_sms(authyId, true, function(err, response) {
            if (err) {
                console.log(err)
                return res.json({success: false, error:constants.errors.server_error});
            } else {
                return res.json({success: true, data: { authyId: authyId, message: 'successfully sent code.'}});
            }
        });
    }
});
router.post('/verifyAuthyToken', function(req, res) {
    let authyId = req.body.authyId
    let otp = req.body.confirmcode
    authy.verify(authyId, otp, function(err, response) {
        if (err) {
            return res.json({success: false, error: constants.errors.user.verify_failed});
        } else {
            return res.json({success: true, data: { message: 'successfully verified.'}});
        }
    });
});
router.post('/signup', function(req, res) {
  
  User.findOne({'email':req.body.email}, function (err, user) {
    if (user) {
      return res.json({
        success: false,
        error: constants.errors.user.duplicated_email
      }); 
    } else {
      var newRestaurant = new Restaurant();
      newRestaurant.save();
      var newUser = new User({
        username: req.body.name,
        password: req.body.password,
        email: req.body.email,
        phone_number: req.body.phone_number,
        country_code: req.body.country_code,
        phone: `${req.body.country_code}${req.body.phone_number}`,
        role: req.body.admin_role,
        company_id: newRestaurant._id,
        status: constants.status.pending
      });
      customer_id = parseInt(String(newUser._id).substr(1, 5), 16);
      newUser.customer_id = customer_id
      // save the user
      newUser.save(function(err) {
        if (err) {
          return res.json({
            success: false,
            error: constants.errors.server_error
          }); 
        } else {
          return res.json({
            success: true,
            data: {
              user: newUser,
              company: newRestaurant
            }
          });
        }
      });
    }
  });
});
  
router.post('/signin', function(req, res) {
  User.findOne({$or:[ {'phone': req.body.phoneOremail}, {'email': req.body.phoneOremail}]}, function(err, user) {
    if (err) throw err;

    if (!user) {
      return res.json({
        success: false,
        error: constants.errors.user.auth_fail
      });
    } else {
      if (user.recover_password == req.body.password) {
        sendUserInfo(user)
      } else {
          // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            // var token = jwt.sign(user, config.secret);
            // return the information including token as JSON
            sendUserInfo(user)
          } else {
            return res.json({
              success: false,
              error: constants.errors.user.auth_fail
            });
          }
        });
      }
      function sendUserInfo(user) {
        if (user.status == constants.status.approved) {
          return res.json({success: true, data:{
            user: user
          }});
        }
        if (user.status == constants.status.pending) {
          
          return res.json({
            success: false,
            error: constants.errors.user.pending
          });
        } 
        if (user.status == constants.status.rejected) {
          
          return res.json({
            success: false,
            error: constants.errors.user.rejected
          });
        }  
      }
    }
  });
});

router.post('/register_company', function(req, res) {
  let company_id = req.body.company_id
  let company_data = req.body.company_data
  let user_id = req.body.user_id
  let user_email = req.body.user_email
  Restaurant.findOneAndUpdate({ _id: new ObjectId(company_id)}, { $set: { company_profile: company_data } }, {new: true}, function(err, restaurant) {
    if (err) {
      return res.json({
        success: false,
        error: constants.errors.server_error
      });
    } else {

      let subject = 'DinnerBell Company Registered'
      let html = '<p>Thanks you, your application successfully submitted. We are going to review and will get back to you shortly</p>'
      var data = {
        from: constants.mailgun.from,
        to: user_email,
        subject: subject,
        html: html
      };
      mailgun.messages().send(data, function (error, body) {
        console.log(body);
      });
      var restaurant = restaurant
      console.log('restaurant=>',restaurant)
      User.findOne({'role':constants.role_type.super_visior}, function (err, super_visior) {
        if (err || !super_visior) {
          return res.json({
            success: false,
            error: constants.errors.server_error
          });
        } else {
          User.findOne({'role':constants.role_type.super_visior}, function (err, super_visior) {
            if (err || !super_visior) {
              return res.json({
                success: false,
                error: constants.errors.server_error
              });
            } else {
              // name: {
              //   type: String
              // },
              // dining_style: String,
              // cuisines: String,
              // contact_person: {
              //   fullname: String,
              //   title: String
              // },
              // contact_information: {
              //   country: String,
              //   city: String,
              //   state_province_region: String,
              //   street_address: String,
              //   zip_code: String,
              //   phone_number: String,
              //   website_address: String
              // },
              // options: {
              //   digital_menu: Boolean,
              //   graphic_design: Boolean,
              //   branding: Boolean,
              //   marketng: Boolean,
              //   photo_video: Boolean,
              //   web: Boolean
              // }
              var fullUrl = req.headers.host;
              let acceptUrl = fullUrl + '/admin/auth/approve/' + user_id
              let rejectUrl = fullUrl + '/admin/auth/reject/' + user_id
              let subject = 'New Company Register'
              let companyHtml = `<table>
              <tr><th style='width:120px;text-align:left'>Company Name: </th><td>${company_data.name}</td></tr>
              <tr><th style='width:120px;text-align:left'>Dining style: </th><td>${company_data.dining_style}</td></tr>   
              <tr><th style='width:120px;text-align:left'>Cusines: </th><td>${company_data.cuisines}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Full name: </th><td>${company_data.contact_person.fullname}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Title: </th><td>${company_data.contact_person.title}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Country: </th><td>${company_data.contact_information.country}</td></tr>  
              <tr><th style='width:120px;text-align:left'>City: </th><td>${company_data.contact_information.city}</td></tr>  
              <tr><th style='width:120px;text-align:left'>State/Province: </th><td>${company_data.contact_information.state_province_region}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Street Address: </th><td>${company_data.contact_information.street_address}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Phone Number: </th><td>${company_data.contact_information.phone}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Website Address: </th><td>${company_data.contact_information.website_address}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Digital Menu: </th><td>${company_data.options.digital_menu?'Yes':'No'}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Graphic Design: </th><td>${company_data.options.graphic_design?'Yes':'No'}</td></tr> 
              <tr><th style='width:120px;text-align:left'>Branding: </th><td>${company_data.options.branding?'Yes':'No'}</td></tr> 
              <tr><th style='width:120px;text-align:left'>Marketing: </th><td>${company_data.options.marketing?'Yes':'No'}</td></tr> 
              <tr><th style='width:120px;text-align:left'>Photo / Video: </th><td>${company_data.options.photo_video?'Yes':'No'}</td></tr>  
              <tr><th style='width:120px;text-align:left'>Web: </th><td>${company_data.options.web?'Yes':'No'}</td></tr>  
              </table><br>
              `
              let html = `<p>Restaurant ${restaurant.company_profile.name} requested review</p>${companyHtml}
                              you can <a href=${acceptUrl}>Approve</a> or <a href=${rejectUrl}>Reject</a>
                              `
              var data = {
                from: constants.mailgun.from,
                to: super_visior.email,
                subject: subject,
                html: html
              };
              mailgun.messages().send(data, function (error, body) {
                console.log(body);
              });
            }
          })
        }
      })
      return res.json({
        success: true,
        data: {}
      });
    }
  });
});

router.post('/change_password', function(req, res){
  let user_id = req.body.user_id
  let password = req.body.password
  User.findOne({_id: new ObjectId(user_id)}, function (err, user) {
    if (err) {
      return res.json({
        success: false,
        error: constants.errors.server_error
      });
    } else {
      if (user.recover_password == password.old) {
        user.password = password.new
        doChange(user)
      } else {
          // check if password matches
        user.comparePassword(password.old, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            // var token = jwt.sign(user, config.secret);
            // return the information including token as JSON
            user.password = password.new
            doChange(user)
          } else {
            return res.json({
              success: false,
              error: constants.errors.user.incorrect_old_password
            });
          }
        });
      }
      function doChange(user) {
        user.save(function (err, newuser) {
          if (err) {
            return res.json({
              success: false,
              error: constants.errors.server_error
            });
          } else {
            return res.json({
              success: true,
              data: {}
            });
          }
        })
      }
      
      
    }
  });
});

router.post('/send_password', function(req, res) {
  var subject = 'DinnerBell recovery password.'
  var randomPass = Math.random().toString(36).substring(6);
  var html = `Your temp password is <strong>${randomPass}</strong><br><a href='${constants.admin_site_url}'>Click here to login</a> <br> This password is available for an hour`

  User.findOne({$or:[ {'customer_id': req.body.emailOrCustomerID}, {'email': req.body.emailOrCustomerID}]}, function(err, user){
    if (err) {
      return res.json({success: false, error: constants.errors.server_error})
    } else {
      if (user) {
        user.recover_password = randomPass
        user.save(function (err, newuser) {
          if (err) {
            console.log(3)
            return res.json({
              success: false,
              error: constants.errors.server_error
            });
          } else {
            var data = {
              from: constants.mailgun.from,
              to: user.email,
              subject: subject,
              html: html
            };
            mailgun.messages().send(data, function (error, body) {
              if (error) {
                return res.json({success: false, error: constants.errors.mailsend_error})
              } else {
                return res.json({success: true, data: {}})
              }
            });
          }
        })
      } else {
        return res.json({success: false, error: constants.errors.user.user_not_found})
      }
    }
  })
 
});

router.get('/approve/:user_id', function (req, res) {
  var user_id = req.params.user_id
  changeUserStatus(res, user_id, constants.status.approved)
});
router.get('/reject/:user_id', function (req, res) {
  var user_id = req.params.user_id
  changeUserStatus(res, user_id, constants.status.rejected)
});
function changeUserStatus(res, user_id, status) {
  User.findOneAndUpdate({_id: new ObjectId(user_id)},{$set: {status: status}}, {new: true}, function(err, user){
    if (err) {
      res.writeHeader(200, {"Content-Type": "text/html"});  
      res.write(`<h2>${constants.errors.server_error}</h2>`);  
      res.end();
    } else {
      var user = user
      console.log(user)
      Restaurant.findOne({_id: new ObjectId(user.company_id)}, function(err, companyinfo){
        
        if (err || !companyinfo) {
          res.writeHeader(200, {"Content-Type": "text/html"});  
          res.write(`<h2>${constants.errors.server_error}</h2>`);  
          res.end();
        } else {
          res.writeHeader(200, {"Content-Type": "text/html"}); 
          res.write(`<h2>Successfully ${status}</h2>`);   
          res.end();
          sendMailToUser(user, companyinfo);
        }
      
      });
    }
  })
  function sendMailToUser(user, companyinfo) {
    let email = user.email
    let subject = 'Your account updated'
    let frommail = constants.frommail
    let status = user.status
    let html = ''
    if (status == constants.status.approved) {
      html = `<p>Dear ${companyinfo.company_profile.contact_person.fullname},</p><p> Congratulations, your application has been approved. Your customer ID is ${user.customer_id}.</p><p> Now you can login into your personal admin panel on our website.</p><p><a href='${constants.admin_site_url}'>Click here to login</a></p>`
    } else {
      html = `<p>Dear ${companyinfo.company_profile.contact_person.fullname},</p><p> we're sorry to inform that your application has been denied at this time.</p>`
    }
    var data = {
      from: constants.mailgun.from,
      to: email,
      subject: subject,
      html: html
    };
    
    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  }
}
module.exports = router;
