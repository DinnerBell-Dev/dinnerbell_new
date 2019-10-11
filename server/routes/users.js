var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var constants = require("../config/constants");
var mailgun = require('mailgun-js')({
    apiKey: constants.mailgun.api_key,
    domain: constants.mailgun.DOMAIN
});
var async = require('async');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var cron = require('node-cron');
var moment = require('moment');
var IngredientCategory = require("../models/ingredient_category");
var Ingredient = require("../models/ingredient");
var Menu = require("../models/menu");
var CronTable = require("../models/crontable");
var Label = require("../models/label");
var Employee = require("../models/employee");
var MenuItem = require("../models/menu_item");
var MenuCustomization = require("../models/menu_customization");
var ThemeActive = require("../models/theme_active");
var ThemeSetting = require("../models/theme_setting");

var ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs');
var speakeasy = require("speakeasy");
var QRCode = require('qrcode');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('12345678');
var AdmZip = require('adm-zip');

var mongoose = require('mongoose');
var conn = mongoose.connection;
// var Grid = require('gridfs-stream');
var Grid = require('gridfs');
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
/**
 * To perfom new user registration.
 */
router.post('/signup', function (req, res) {
    if (!req.body.email) {
        return res.json({
            success: false,
            error: constants.errors.invalid_params
        });
    }
    User.findOne({
        'email': new RegExp('^' + req.body.email + '$', "i")
    }, function (err, user) {

        if (user) {
            return res.json({
                success: false,
                error: constants.errors.user.duplicated_email,
                email: req.body.email
            });

        } else {

            var newUser = new User({
                email: req.body.email,
                fullname: req.body.fullname,
                country: req.body.country,
                city: req.body.city,
                state: req.body.state,
                address: req.body.address,
                zipcode: req.body.zipcode,
                website: req.body.website,
                countrycode: req.body.countrycode,
                phone: req.body.phone,
                businesstype: req.body.businesstype,
                notes: req.body.notes,
                companyname: req.body.companyname,
                occupation: req.body.occupation,
                cuisinesserved: req.body.cuisinesserved,
                digitalmenu: req.body.digitalmenu,
                graphicdesign: req.body.graphicdesign,
                branding: req.body.branding,
                marketting: req.body.marketting,
                photovideo: req.body.photovideo,
                web: req.body.web,
                lastlogin: Date.now(),
                restaurantCode: Math.floor(1000000 + Math.random() * 9000000)
            });

            newUser.save(function (err, response) {
                if (err) {
                    console.log(err)
                    return res.json({
                        success: false,
                        msg: 'Username already exists.'
                    });
                }
                this.createPassword(newUser, res);
            });
        }

    });

});

/**
 * Sends instructions to create password to new user's email.
 */
createPassword = function (data, userres) {

    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({
                email: new RegExp('^' + data.email + '$', "i")
            }, function (err, user) {
                if (!user) {
                    return userres.json({
                        success: false,
                        error: constants.errors.user.email_not_found
                    });
                } else {

                    user.createPasswordToken = token;
                    user.save(function (err) {
                        done(err, token, user);
                    });
                }


            });
        },
        function (token, user, done) {

            var data = {
                from: constants.mailgun.from,
                to: user.email,
                subject: 'DinnerBell create your password.',
                html: 'You are receiving this because you (or someone else) have requested to create password for your account.\n\n <br> <br> ' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n <br> <br> ' +
                    '' + constants.site_url + 'createpassword/' + token + '\n\n <br> <br> ' +
                    'If you did not request this, please ignore this email.\n <br> <br> '
            };
            mailgun.messages().send(data, function (error, body) {
                if (error) {
                    return userres.json({
                        success: false,
                        error: constants.errors.mailsend_error
                    });
                } else {
                    return userres.json({
                        success: true,
                        email: user.email,
                        message: 'Instructions to create password sent to your mail. Please check your mail.'
                    });
                }
            });
        }
    ], function (err) {
        if (err) { }
    });

};

/**
 * To check password link is valid or not.
 */
router.get('/createpassword/:token', function (req, res) {
    User.findOne({
        createPasswordToken: req.params.token,
    }, function (err, user) {
        if (!user) {
            return res.json({
                success: false,
                message: 'Password reset token is invalid'
            });
        } else {
            return res.json({
                success: true
            });
        }

    });
});


/**
 * To create user password to complete registration process.
 */
router.post('/createpassword', function (req, res) {
    re = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}/;

    if (!re.test(req.body.password)) {
        res.render('createpassword', {
            error: 'Password is invalid. Please try again. ',
            message: '* Your password should consist of one lower case letter, one upper case letter , one digit, and one of special characters ~!@#$%^&*()_+'
        });
    } else {

        async.waterfall([
            function (done) {
                User.findOne({
                    createPasswordToken: req.body.token
                }, function (err, user) {
                    if (!user) {
                        return res.json({
                            success: false,
                            error: 'Link to create password is invalid.Please check your mail again.'
                        })
                    } else {
                        user.password = req.body.password;
                        user.lastlogin = Date.now();
                        user.createPasswordToken = undefined;
                        // save user's data
                        user.save(function (err, userdata) {

                            this.sendEmailNotifications(constants.subscription_parameters.first_notification, user.email, 'Trial period first notification'); // notification to be sent to user after 2 days
                            this.sendEmailNotifications(constants.subscription_parameters.second_notification, user.email, 'Trial period second notification'); // notification to be sent to user after 10 days
                            this.sendEmailToAdmin(constants.admin_email, "Notification regarding new user registration at dinnerbell with email :" + user.email + "<br> <a href =" + constants.admin_dashboard + ">Click here for dinnerbell admin dashboard.</a>"); // notification to be sent to admin regarding new user registration
                            this.createGuestUser(user);

                            this.setDaysLeft(user); // calls to change the default status of new user
                            // let notificationTime = ((user.createdAt.getMinutes() + 2) + ' ' + user.createdAt.getHours() + ' * * *');
                            let notificationTime = ('* * * * *');
                            var task = cron.schedule(notificationTime, () => {

                                // to destry cron jobs based on user's status.
                                User.findById(user._id, function (err, res) {
                                    if (err) throw err;
                                    if (res.status == 'Basic plan' || res.status == 'Advanced plan') {
                                        task.destroy();
                                    } else {
                                        this.setDaysLeft(user);
                                        User.findById(user._id, function (err, res) {
                                            if (err) throw err;
                                            if (res.status == 'Trail period expired') {
                                                task.destroy();
                                            }
                                        });
                                    }
                                });

                            }); // cron function ends

                            // always running cron jobs to check inactive days of user
                            let alwaysTime = ('1 13 * * *');
                            cron.schedule(alwaysTime, () => {
                                this.inactiveDays(user);
                            });

                            // send updated user's data for signup
                            User.findById(user._id, function (err, resdata) {
                                if (err) throw err;
                                // used to add default menus
                                this.addDefaultMenu(user._id, constants.default_user_data.menus);
                                // used to add menu customization settings
                                this.addmenuCustomizations(user._id);
                                // used to add default ingredints
                                this.addDefaultIngredients(user._id, constants.default_user_data.categories);
                                // send sign up response to user.
                                return res.json({
                                    success: true,
                                    user: resdata
                                });
                            });
                        });

                        var maildata = {
                            from: constants.mailgun.from,
                            to: user.email,
                            subject: 'DinnerBell registration complete.',
                            html: 'Hello,\n\n <br> <br>' +
                                'This is a confirmation that the password for your account ' + user.email + ' has just been created and your registration process is complete.\n  <br> <br>'
                        };
                        mailgun.messages().send(maildata, function (error, body) {
                            if (error) {
                                return res.json({
                                    success: false,
                                    error: constants.errors.mailsend_error
                                })
                            } else {
                                console.log('Mail sent successfully');
                            }
                        }); // mail function  ends

                    }
                });
            }
        ], function (err) {
            res.redirect('/');
        });

    }

});

/**
 * To perfom user signin
 */
router.post('/signin', function (req, res) {
    User.findOne({
        email: new RegExp('^' + req.body.email + '$', "i")
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            return res.json({
                success: false,
                error: constants.errors.user.email_not_found,
                email: req.body.email
            });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    return res.json({
                        success: true,
                        user: user
                    });
                } else {
                    return res.json({
                        success: false,
                        error: constants.errors.user.auth_fail
                    });
                }
            });

        }
    });
});

/**
 * To change password of user
 */
router.post('/changepassword/:userId', function (req, res) {

    User.findById(req.params.userId)
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Users not found with id " + req.params.userId
                });
            } else {
                // check if password matches
                Users.comparePassword(req.body.oldpassword, function (err, isMatch) {
                    if (isMatch && !err) {
                        Users.password = req.body.newpassword;
                        Users.save();
                        return res.json({
                            success: true,
                            message: 'Password changed successfully.'
                        });
                    } else {
                        return res.json({
                            success: false,
                            message: 'Old password not matched.'
                        });
                    }
                });
            }
        })

});


/**
 * Sends password recovery instructions to user's email in case of forgot password.
 */
router.post('/send_password', function (req, res) {

    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({
                email: new RegExp('^' + req.body.emailOrCustomerID + '$', "i")
            }, function (err, user) {
                if (!user) {
                    return res.json({
                        success: false,
                        error: constants.errors.user.email_not_found
                    });
                } else {

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 14400000; // 4 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                }


            });
        },
        function (token, user, done) {

            var data = {
                from: constants.mailgun.from,
                to: user.email,
                subject: 'DinnerBell recovery password.',
                html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n <br> <br> ' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n <br> <br> ' +
                    'http://' + req.headers.host + '/app/api/user/reset/' + token + '\n\n <br> <br> ' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n <br> <br> '
            };
            mailgun.messages().send(data, function (error, body) {
                if (error) {
                    return res.json({
                        success: false,
                        error: constants.errors.mailsend_error
                    })
                } else {
                    return res.json({
                        success: true,
                        data: {},
                        body: body

                    })
                }
            });
        }
    ], function (err) {
        if (err) { }
    });

});


/**
 * To check password reset link is valid or not.
 */
router.get('/reset/:token', function (req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (!user) {
            res.writeHeader(200, {
                "Content-Type": "text/html"
            });
            res.write("<div style = 'background: #f4451d; color: #fff'><br> <br><h2 align = center > Password reset token is invalid or has expired. </h2> <br> <br> </div>");
            res.end();
        } else {
            res.render('forgot', {
                user: req.user
            });
        }

    });
});

/**
 * To show user a form to enter new password or to reset forgot password.
 */
router.post('/reset/:token', function (req, res) {
    re = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/;

    if (req.body.password != req.body.confirm) {
        res.render('forgot', {
            error: "Confirm password didn't match !! Please try again "
        });
    } else if (!re.test(req.body.password)) {
        res.render('forgot', {
            error: 'Password is invalid. Please try again. ',
            message: '* Your password has to be at least 8 characters long, at least one lower case letter, one upper case letter , one digit, and one of special characters ~!@#$%^&*()_+'
        });
    } else {

        async.waterfall([
            function (done) {
                User.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {
                        $gt: Date.now()
                    }
                }, function (err, user) {
                    if (!user) {
                        res.writeHeader(200, {
                            "Content-Type": "text/html"
                        });
                        res.write("<div style = 'background: #f4451d; color: #fff'><br> <br><h2 align = center >Password reset token is invalid or has expired. </h2> <br> <br> <div>");
                        res.end();
                    } else {
                        user.password = req.body.password;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        // save user's data
                        user.save(function (err) { });

                        var data = {
                            from: constants.mailgun.from,
                            to: user.email,
                            subject: 'DinnerBell recovery password.',
                            html: 'Hello,\n\n <br> <br>' +
                                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n  <br> <br>'
                        };
                        mailgun.messages().send(data, function (error, body) {
                            if (error) {
                                return res.json({
                                    success: false,
                                    error: constants.errors.mailsend_error
                                })
                            } else {
                                res.writeHeader(200, {
                                    "Content-Type": "text/html"
                                });
                                res.write("<div style = 'background: #e9ecef;color: #000'> <br> <br><h2 align = center >Congratulations, your password changed successfully.</h2> <br> <br> ");
                                res.write("<div style = 'background: #e9ecef'> <br> <br><h2 align = center ><a href = " + constants.site_url + ">Click here for login</a></h2> <br> <br> ");
                                res.end();
                            }
                        });

                    }
                });
            }
        ], function (err) {
            res.redirect('/');
        });

    }


});

/**
 * To test email functionality is working or not via mail gun
 */
router.get('/test', function (req, res) {
    var data = {
        from: constants.mailgun.from,
        to: "nomuranori9291@gmail.com",
        subject: "hello",
        html: "<p>yes</p>"
    };
    mailgun.messages().send(data, function (error, body) { });
    return res.json(3)
})

/**
 * Admin api to list all the registred users at admin dashboard.
 */
router.get('/allusers', function (req, res) {
    User.find()
        .then(Users => {
            res.send(Users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users."
            });
        });
});

/**
 * Admin api to delete a particular user based on user's id.
 */
router.delete('/allusers/:usersId', function (req, res) {

    User.findByIdAndRemove(req.params.usersId)
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            res.send({
                message: "User deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.usersId
            });
        });
});

/**
 * Admin api to get single user data based on user's id.
 */
router.get('/allusers/:usersId', function (req, res) {

    User.findById(req.params.usersId)
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Users not found with id " + req.params.usersId
                });
            }
            return res.json({
                success: true,
                user: Users
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            return res.status(500).send({
                message: "Error retrieving users with id " + req.params.usersId
            });
        });
});


/**
 * Admin api to update single user data based on user's id.
 */
router.put('/allusers/:usersId', function (req, res) {

    User.findByIdAndUpdate(req.params.usersId, req.body, {
        new: true
    })
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Users not found with id " + req.params.usersId
                });
            }
            if (req.body.status) {
                this.sendEmailNotifications(0, Users.email, 'Your plan is changed to : ' + req.body.status); // send email to user if user's status/plan changed.
            }
            res.send({
                success: true,
                user: Users
            });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            return res.status(500).send({
                message: "Error retrieving users with id " + req.params.usersId
            });
        });
});

/**
 * Api to update/change email address
 */
router.put('/updatemail/:usersId', function (req, res) {

    User.findOne({
        email: new RegExp('^' + req.body.email + '$', "i")
    }, function (err, user) {
        if (user) {
            return res.json({
                success: false,
                error: constants.errors.user.duplicated_email,
                email: req.body.email
            });

        } else {
            User.findByIdAndUpdate(req.params.usersId, req.body, {
                new: true
            })
                .then(Users => {
                    if (!Users) {
                        return res.status(404).send({
                            message: "Users not found with id " + req.params.usersId
                        });
                    }
                    res.send({
                        success: true,
                        user: Users
                    });
                })
        }

    });
});





/**
 * Sends an email notification to user email regrding subscription status at dinnerbell.
 */
sendEmailNotifications = function (numberOfDaysToAdd, useremail, message) {
    // logic to send email notifications
    const someDate = new Date();
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    //let notificationTime = ((someDate.getMinutes() + 1) + ' ' + someDate.getHours() + ' ' + someDate.getDate() + ' ' + (someDate.getMonth() + 1) + ' ' + (someDate.getDay() + 1));
    let notificationTime = ('* * ' + someDate.getDate() + ' * *');
    var task = cron.schedule(notificationTime, () => {
        var data = {
            from: constants.mailgun.from,
            to: useremail,
            subject: "Dinnerbell notification",
            html: "<p>" + message + "</p>"
        };
        mailgun.messages().send(data, function (error, body) {
            if (error) {
                // console.log('Email Error : ', error);
            } else {
                //console.log('mail sent successfully : ', useremail);
                task.destroy(); // destroy cron task.
            }
        }); // mail function ends

    }); // cron function ends


};


/**
 * Sends an email notification to admin email regrding new user registration at dinnerbell.
 */
sendEmailToAdmin = function (admin_email, message) {

    var data = {
        from: constants.mailgun.from,
        to: admin_email,
        subject: "Dinnerbell notification",
        html: "<p>" + message + "</p>"
    };
    mailgun.messages().send(data, function (error, body) {
        if (error) {
            //console.log('Email Error : ', error);
        } else {
            // console.log('mail sent successfully : ', body);
        }
    }); // mail function ends

};

/**
 * Set user's status days left
 */
setDaysLeft = function (newUser) {
    const expireDate = new Date(newUser.createdAt);
    const currentDate = new Date();
    var dateCurr = moment(currentDate);
    var dateExp = moment(expireDate);
    dateExp.add(constants.subscription_parameters.expiration_period + 1, 'days'); // set days to expire
    let daysleft = dateExp.diff(dateCurr, 'days');
    // console.log('daysleft ', daysleft);
    if (daysleft < 0 || daysleft == 0) {
        var newvalues = {
            $set: {
                status: 'Trail period expired'
            }
        };
    } else if (daysleft == 1) {
        var newvalues = {
            $set: {
                status: 'Trial period: 1 day left'
            }
        };
    } else {
        var newvalues = {
            $set: {
                status: 'Trial period: ' + daysleft + ' days left'
            }
        };
    }
    User.findByIdAndUpdate(newUser._id, newvalues, function (err, res) {
        if (err) throw err;
        //console.log("status updated");
    });
};

/**
 * Used to check user's inactive days.
 */
inactiveDays = function (user) {
    const currentDate = new Date();
    const loginDate = new Date(user.lastlogin);
    var dateCurr = moment(currentDate);
    var datelog = moment(loginDate);
    let days = dateCurr.diff(datelog, 'days');
    // console.log('days ', days);
    if (days > 1) {
        this.sendEmailNotifications(0, user.email, "Hello " + user.fullname + " , you are inactive at dinnerbell for about : " + days + " days");
    }
};

router.post('/addIngredientCategory', function (req, res) {
    let newCategory = new IngredientCategory()
    newCategory.name = req.body.name
    newCategory.user_id = req.body.user_id
    newCategory.photo_url = req.body.photo_url
    newCategory.photo_name = req.body.photo_name
    newCategory.company_id = new ObjectId(req.body.company_id)
    req.body.ingredients.forEach(element => {
        this.addIngredientItems(element, newCategory, newCategory.company_id);
    });
    newCategory.save((err, data) => {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            })
        } else {
            return res.json({
                success: true,
                message: 'Category created successfully.',
                data: data
            });
        }
    });
});

/**
 * add ingredient items from category to create new category
 */
addIngredientItems = function (ingredient, newCategory, compid) {
    let newIngredient = new Ingredient()
    newIngredient.name = ingredient.name
    newIngredient.description = ingredient.description
    newIngredient.photo_url = ingredient.photo_url
    newIngredient.photo_name = ingredient.photo_name
    newIngredient.company_id = compid

    newIngredient.save((err, ingredientdata) => {
        if (err) {
            console.log('Error : ', err);
        } else {
            newCategory.ingredients.push(ingredientdata);
        }
    })
};

/**
 * Admin api to update ingredient category
 */
router.put('/updateIngredientCat/:catId', function (req, res) {

    req.body.ingredients.forEach(element => {
        let newIngredient = new Ingredient()
        newIngredient.name = element.name
        newIngredient.description = element.description
        newIngredient.photo_url = element.photo_url
        newIngredient.photo_name = element.photo_name
        newIngredient.price = element.price
        newIngredient.label = element.label
        newIngredient.company_id = req.body.company_id

        newIngredient.save((err, ingredientdata) => {
            if (err) {
                console.log('Error : ', err);
            } else {
                req.body.ingredients.push(ingredientdata);
            }
        });
    });

    IngredientCategory.findByIdAndUpdate(req.params.catId, req.body, {
        new: true
    })
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Ingredient category not found with id " + req.params.catId
                });
            }
            res.send({
                success: true,
                user: Users
            });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Ingredient category not found with id " + req.params.catId
                });
            }
            return res.status(500).send({
                message: "Error retrieving ingredient category with id " + req.params.catId
            });
        });
});


/**
 * Api to get ingredient category based on user_id
 */
router.get('/ingredientCategory/:user_id', function (req, res) {
    IngredientCategory.find({
        user_id: req.params.user_id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with user_id : ' + req.params.user_id
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});

router.post('/addMenu', function (req, res) {

    var newMenu = new Menu({
        name: req.body.name,
        user_id: req.body.user_id,
        status: req.body.status,
        from_at: req.body.from_at,
        to_at: req.body.to_at,
        menu_type: req.body.menu_type,
        photo_url: req.body.photo_url,
        photo_name: req.body.photo_name,
        subsection: req.body.subsection,
        subsection_switch: req.body.subsection_switch,
        course: req.body.course,
        meal_price: req.body.meal_price
    });

    newMenu.save(function (err, response) {
        if (err) {
            console.log(err);
        } else {
            return res.json({
                success: true,
                data: response
            });
        }
    });

});

/**
 * Used to add menu item
 */
router.post('/addMenuItem', function (req, res) {

    var newMenu = new MenuItem({
        user_id: req.body.user_id,
        menu_id: req.body.menu_id,
        name: req.body.name,
        description: req.body.description,
        menu_type: req.body.menu_type,
        label: req.body.label,
        item_type: req.body.item_type,
        photo_urls: req.body.photo_urls,
        photo_name: req.body.photo_name,
        spice_options: req.body.spice_options,
        questions: req.body.questions,
        size_prize: req.body.size_prize,
        ingredients: req.body.ingredients,
        menus: req.body.menus,
        used_ingredient: req.body.used_ingredient,
        ingredientCustomTitle: req.body.ingredientCustomTitle,
    });

    newMenu.save(function (err, response) {
        if (err) {
            console.log(err);
        } else {
            return res.json({
                success: true,
                data: response
            });
        }
    });

});

/**
 * Used to add menu customization settings
 */
router.post('/addMenuCustomization', function (req, res) {
    var newMenuCus = new MenuCustomization({
        user_id: req.body.user_id,
        ingredient_type: req.body.ingredient_type,
        ingredient_quantity: req.body.ingredient_quantity,
        spice_title: req.body.spice_title,
        spice_number_options: req.body.spice_number_options,
        prefrences_title: req.body.prefrences_title,
    });
    newMenuCus.save(function (err, response) {
        if (err) {
            console.log(err);
        } else {
            return res.json({
                success: true,
                data: response
            });
        }
    });
});

/**
 * Api to update menu customization based on _id
 */
router.put('/updateMenuCustomization/:_id', function (req, res) {

    MenuCustomization.findByIdAndUpdate(req.params._id, req.body, {
        new: true
    })
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Menu not found with id " + req.params.menu_id
                });
            }
            res.send({
                success: true,
                data: Users
            });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Menu not found with id " + req.params.menu_id
                });
            }
            return res.status(500).send({
                message: "Error retrieving menu with id " + req.params.menu_id
            });
        });
});

/**
 * Api to get menu customization based on user_id
 */
router.get('/menuCustomization/:user_id', function (req, res) {
    MenuCustomization.find({
        user_id: req.params.user_id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with user_id : ' + req.params.user_id
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});


/**
 * Used to get all available menus
 */
router.get('/getAllMenu/:user_id', function (req, res) {

    Menu.find({
        user_id: req.params.user_id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with user_id : ' + req.params.user_id
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});

/**
 * Used to get menu based on _id
 *  */
router.get('/getMenu/:_id', function (req, res) {

    Menu.find({
        _id: req.params._id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with _id : ' + req.params._id
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});

/**
 * Api to update menu data based on menu id
 */
router.put('/updateMenu/:menu_id', function (req, res) {

    Menu.findByIdAndUpdate(req.params.menu_id, req.body, {
        new: true
    })
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Menu not found with id " + req.params.menu_id
                });
            }
            res.send({
                success: true,
                data: Users
            });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Menu not found with id " + req.params.menu_id
                });
            }
            return res.status(500).send({
                message: "Error retrieving menu with id " + req.params.menu_id
            });
        });
});


/**
 * To delete menu based on user_id
 */
router.delete('/deleteMenu/:user_id', function (req, res) {

    Menu.findByIdAndRemove(req.params.user_id)
        .then(datares => {
            if (!datares) {
                return res.status(404).send({
                    message: "menu not found with user_id " + req.params.user_id
                });
            }
            res.send({
                success: true,
                message: "Menu deleted successfully!"
            });
        }).catch(err => {
            return res.status(500).send({
                message: "Could not delete menu with user_id " + req.params.user_id
            });
        });
});

/**
 * To delete menu item based on item_id
 */
router.delete('/deleteMenuItem/:item_id', function (req, res) {

    MenuItem.findByIdAndRemove(req.params.item_id)
        .then(datares => {
            if (!datares) {
                return res.status(404).send({
                    message: "menu item not found with item_id " + req.params.item_id
                });
            }
            res.send({
                success: true,
                message: "Menu item deleted successfully!"
            });
        }).catch(err => {
            return res.status(500).send({
                message: "Could not delete menu item with item_id " + req.params.item_id
            });
        });
});

/**
 * Admin api to update ingredient category
 */
router.put('/updateMenuItem/:item_id', function (req, res) {

    MenuItem.findByIdAndUpdate(req.params.item_id, req.body, {
        new: true
    })
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Menu item not found with id " + req.params.item_id
                });
            }
            res.send({
                success: true,
                data: Users
            });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Menu item not found with id " + req.params.item_id
                });
            }
            return res.status(500).send({
                message: "Error retrieving menu item with id " + req.params.item_id
            });
        });
});

/**
 * Used to get menu item
 */
router.get('/getMenuItem/:_id', function (req, res) {

    MenuItem.find({
        _id: req.params._id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with _id : ' + req.params._id
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});

/**
 * Used to get menu item
 */
router.get('/getAllMenuItem/items/:user_id', function (req, res) {

    MenuItem.find({
        user_id: req.params.user_id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found'
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});



/**
 * Api to get all menu items based on menu_id
 */
router.get('/menuItems/:menu_id', function (req, res) {
    MenuItem.find({
        menu_id: req.params.menu_id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with menu_id : ' + req.params.menu_id
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});

/**
 * Used to add label
 */
router.post('/addLabel', function (req, res) {
    var newLabel = new Label({
        name: req.body.name,
    });
    newLabel.save(function (err, response) {
        if (err) {
            console.log(err);
        } else {
            return res.json({
                success: true,
                data: response
            });
        }
    });
});

/**
 * Used to get all Labels
 */
router.get('/getAllLabels', function (req, res) {
    // New,Popular,Chef's Choice,Spicy,Vegan,Organic,None
    Label.find({}, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'No labels available'
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }
    });
});

/**
 * add menu customization
 */
addmenuCustomizations = function (userid) {
    var newMenuCus = new MenuCustomization({
        user_id: userid
    });
    newMenuCus.save(function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log('Menu customizations added successfully')
        }
    });
};

/**
 * add menu customization
 */
addDefaultMenu = function (user_id, menus) {
    menus.forEach(element => {
        let name = element.menu_name;
        let from_at = new Date();
        from_at.setHours(element.start_hour);
        from_at.setMinutes(30);
        let to_at = new Date();
        to_at.setHours(element.to_hour);
        to_at.setMinutes(30);
        let menu_type = element.menu_type;
        var newMenu = new Menu({
            name: name,
            user_id: user_id,
            from_at: new Date(from_at).toISOString(),
            to_at: new Date(to_at).toISOString(),
            menu_type: menu_type,
            status: 'true',
            photo_url: element.menu_photo
        });
        newMenu.save(function (err, response) {
            if (err) {
                console.log(err);
            } else {
                var newMenu = new MenuItem({
                    user_id: response.user_id,
                    menu_id: response._id,
                    name: element.menu_item.name,
                    description: element.menu_item.description,
                    menu_type: response.menu_type,
                    label: 'New',
                    status: 'true',
                    photo_urls: element.menu_item.photo
                });
                newMenu.save(function (err, response) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('menu item created successfully');
                    }
                });
                console.log('menu created successfully');
            }
        });

    });
};

/**
 * add menu customization
 */
addDefaultIngredients = function (user_id, categories) {

    categories.forEach(item => {

        var newIngredientCat = new IngredientCategory({
            name: item.category_name,
            user_id: user_id,
            photo_name: item.category_photo_name,
            photo_url: item.category_photo_url,
            ingredients: [],
            company_id: new ObjectId()
        });
        newIngredientCat.save(function (err, response) {
            if (err) {
                console.log(err);
            } else {
                item.category_items.forEach(element => {
                    var newIngredientItem = new Ingredient({
                        user_id: response.user_id,
                        category_id: response._id,
                        company_id: response.company_id,
                        description: element.description,
                        label: "Spicy",
                        name: element.name,
                        photo_name: element.photo_name,
                        photo_url: element.photo_url,
                        price: 0
                    });
                    newIngredientItem.save(function (err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            // return res.json({ success: true, data: response });
                            console.log('ingredient cat items created successfully');
                        }
                    });
                });
                console.log('ingredients categories created successfully');
            }
        });
    });

};

/**
 * Used to add Employee
 */
router.post('/addEmployee', function (req, res) {

    if (!req.body.employee.email) {
        return res.json({
            success: false,
            error: constants.errors.invalid_params
        });
    }

    Employee.find({
        user_id: req.body.employee.user_id
    }, function (err, users) {
        if (users) {
            if (users.length !== 0) {
                var emails = users.map(i => i.email.toUpperCase());
                var count = emails.indexOf(req.body.employee.email.toUpperCase());
                if (count == -1) {
                    var newEmployee = new Employee({
                        user_id: req.body.employee.user_id,
                        firstname: req.body.employee.firstname,
                        lastname: req.body.employee.lastname,
                        role: req.body.employee.role,
                        email: req.body.employee.email,
                        countrycode: req.body.employee.countrycode,
                        phone: req.body.employee.phone,
                        country: req.body.employee.country,
                        state: req.body.employee.state,
                        city: req.body.employee.city,
                        zipcode: req.body.employee.zipcode,
                        streetAddress: req.body.employee.streetAddress,
                        token: Math.floor(1000 + Math.random() * 9000)
                    });
                    newEmployee.save(function (err, response) {
                        if (err) {
                            console.log(err);
                        } else {
                            const subject = req.body.restaurant.companyname + " personal code to login into your tablet. ";
                            const first_message = "<div>Hello " + response.firstname + " " + response.lastname + ". Welcome to the " + req.body.restaurant.companyname + " team!</div>\
                        <div>Below is your personal code to login into your tablet: <br><br></div>";
                            const last_message = "<div>Please keep these codes private. If you need to get a new code, please reach out to me.<br><br></div>\
                        <div>Best,</div>\
                        <div>" + req.body.restaurant.fullname + "</div>\
                        <div>" + req.body.restaurant.occupation + "</div>\
                        <div>" + req.body.restaurant.companyname + "</div>\
                        <div> +" + req.body.restaurant.countrycode + req.body.restaurant.phone + "</div>\
                        <div>" + req.body.restaurant.address + "</div>";
                            this.createQrcode(req.body.restaurant.restaurantCode, response, subject, first_message, last_message);
                            return res.json({
                                success: true,
                                data: response
                            });
                        }
                    });
                } else {
                    return res.json({
                        success: false,
                        error: constants.errors.user.duplicated_email,
                        email: req.body.employee.email
                    });
                }
            } else {
                var newEmployee = new Employee({
                    user_id: req.body.employee.user_id,
                    firstname: req.body.employee.firstname,
                    lastname: req.body.employee.lastname,
                    role: req.body.employee.role,
                    email: req.body.employee.email,
                    countrycode: req.body.employee.countrycode,
                    phone: req.body.employee.phone,
                    country: req.body.employee.country,
                    state: req.body.employee.state,
                    city: req.body.employee.city,
                    zipcode: req.body.employee.zipcode,
                    streetAddress: req.body.employee.streetAddress,
                    token: Math.floor(1000 + Math.random() * 9000)
                });
                newEmployee.save(function (err, response) {
                    if (err) {
                        console.log(err);
                    } else {
                        const subject = req.body.restaurant.companyname + " personal code to login into your tablet. ";
                        const first_message = "<div>Hello " + response.firstname + " " + response.lastname + ". Welcome to the " + req.body.restaurant.companyname + " team!</div>\
                      <div>Below is your personal code to login into your tablet: <br><br></div>";
                        const last_message = "<div>Please keep these codes private. If you need to get a new code, please reach out to me.<br><br></div>\
                      <div>Best,</div>\
                      <div>" + req.body.restaurant.fullname + "</div>\
                      <div>" + req.body.restaurant.occupation + "</div>\
                      <div>" + req.body.restaurant.companyname + "</div>\
                      <div> +" + req.body.restaurant.countrycode + req.body.restaurant.phone + "</div>\
                      <div>" + req.body.restaurant.address + "</div>";
                        this.createQrcode(req.body.restaurant.restaurantCode, response, subject, first_message, last_message);
                        return res.json({
                            success: true,
                            data: response
                        });
                    }
                });
            }
        }
    })


});

/**
 * Api to get all employee based on user_id
 */
router.get('/getEmployees/:user_id', function (req, res) {
    Employee.find({
        user_id: req.params.user_id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with user_id : ' + req.params.user_id
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});

/**
 * Used to get Employee by id
 */
router.get('/getEmployee/:_id', function (req, res) {

    Employee.find({
        _id: req.params._id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found'
            });
        } else {
            return res.json({
                success: true,
                data: data
            });
        }

    });
});

/**
 * Used to update employee with id
 */
router.put('/updateEmployee/:_id', function (req, res) {

    if (!req.body.email) {
        return res.json({
            success: false,
            error: constants.errors.invalid_params
        });
    }
    Employee.findOne({
        'email': new RegExp('^' + req.body.email + '$', "i")
    }, function (err, user) {
        if (user != null || user != undefined) {
            if (user._id != req.params._id) {
                return res.json({
                    success: false,
                    error: constants.errors.user.duplicated_email,
                    email: req.body.email
                });

            } else {
                Employee.findByIdAndUpdate(req.params._id, req.body, {
                    new: true
                })
                    .then(Users => {
                        if (!Users) {
                            return res.status(404).send({
                                message: "Employee not found with id " + req.params._id
                            });
                        }
                        res.send({
                            success: true,
                            data: Users
                        });

                    }).catch(err => {
                        if (err.kind === 'ObjectId') {
                            return res.status(404).send({
                                message: "Employee not found with id " + req.params._id
                            });
                        }
                        return res.status(500).send({
                            message: "Error retrieving Employee with id " + req.params._id
                        });
                    });
            }
        } else {
            Employee.findByIdAndUpdate(req.params._id, req.body, {
                new: true
            })
                .then(Users => {
                    if (!Users) {
                        return res.status(404).send({
                            message: "Employee not found with id " + req.params._id
                        });
                    }
                    res.send({
                        success: true,
                        data: Users
                    });

                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "Employee not found with id " + req.params._id
                        });
                    }
                    return res.status(500).send({
                        message: "Error retrieving Employee with id " + req.params._id
                    });
                });
        }

    });
});

/**
 * To delete employee based on id
 */
router.delete('/deleteEmployee/:_id', function (req, res) {

    Employee.findByIdAndRemove(req.params._id)
        .then(datares => {
            if (!datares) {
                return res.status(404).send({
                    message: "Employee not found with item_id " + req.params._id
                });
            }
            res.send({
                success: true,
                message: "Employee deleted successfully!"
            });
        }).catch(err => {
            return res.status(500).send({
                message: "Could not delete Employee with _id " + req.params._id
            });
        });
});


// router.get('/qrcode-generate', (req, res, next) => {
//     var secret = speakeasy.generateSecret({ length: 30 });
//     //using speakeasy generate one time token.
//     var token = speakeasy.totp({
//         secret: secret.base32,
//         encoding: 'base32',
//         window: 60
//     });
//     QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {

//         let base64Image = data_url.split(';base64,').pop();
//         const filename = Date.now() + '.png';
//         fs.writeFile(filename, base64Image, { encoding: 'base64' }, function(err) {
//             //  console.log('File created');
//             var file = filename;
//             var data = {
//                 from: constants.mailgun.from,
//                 to: 'amazekewal@gmail.com',
//                 subject: "Dinnerbell generated Qr-code",
//                 html: '<!DOCTYPE html>\
//                     <html lang="en">\
//                     <head>\
//                     <meta charset="UTF-8">\
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">\
//                     <meta http-equiv="X-UA-Compatible" content="ie=edge">\
//                     <title>Dinnerbell</title>\
//                     </head>\
//                     <body>\
//                     <div class="col-lg-2 col-sm-3 col-xs-6"> OTP : ' + token + ' </div>\
//                     </body>\
//                     </html>',
//                 attachment: file
//             };
//             mailgun.messages().send(data, function(error, body) {
//                 if (error) {
//                     console.log('Email Error : ', error);
//                 } else {
//                     // console.log('mail sent successfully : ');
//                     res.send({ success: true, message: 'Qr-Code sent to mail successfully.' })
//                     fs.unlink(filename, function(err) {
//                         if (err) throw err;
//                         // if no error, file has been deleted successfully
//                         //  console.log('File deleted!');
//                     });
//                 }
//             }); // mail function ends
//         });
//     });

// });

// router.post('/qrcode-verify', (req, res, next) => {
//   var tokenValidates = speakeasy.totp.verify({
//     secret: req.body.secret,
//     encoding: 'base32',
//     token: req.body.token,
//     window: 60
//   });
//   res.send({
//     verified: tokenValidates
//   })
// });

// used to generate/reset code for all employees 
router.post('/reset-codes', (req, res, next) => {

    Employee.find({
        user_id: req.body._id
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with user_id : ' + req.body._id
            });
        } else {
            data.forEach(element => {
                //  console.log(element);
                if (element.role !== 'guest') {
                    const subject = " Your personal codes has been renewed. ";
                    const first_message = "<div>Hello " + element.firstname + " " + element.lastname + ".</div>\
                      <div>Your personal codes has been renewed:<br><br></div>";
                    const last_message = "<div>Please keep these codes private.<br><br> </div>\
                      <div>Thank you,</div>\
                      <div>" + req.body.fullname + "</div>\
                      <div>" + req.body.occupation + "</div>\
                      <div>" + req.body.companyname + "</div>\
                      <div> +" + req.body.countrycode + req.body.phone + "</div>\
                      <div>" + req.body.address + "</div>";
                    element.token = Math.floor(1000 + Math.random() * 9000);
                    updateEmployeeToken(element._id, element.token);
                    this.createQrcode(req.body.restaurantCode, element, subject, first_message, last_message);
                }
            });
            return res.json({
                success: true,
                message: 'New codes sent to mail successfully'
            });
        }
    });
});

// used to generate qrcode for particular user with _id
router.post('/reset-codes/user/', (req, res, next) => {

    Employee.find({
        _id: req.body.employeeId
    }, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                error: 'Data not found with user_id : ' + req.body.employeeId
            });
        } else {
            data.forEach(element => {
                if (element.role !== 'guest') {
                    const subject = " Your personal codes has been reset. ";
                    const first_message = "<div>Hello " + element.firstname + " " + element.lastname + ".</div>\
                      <div>Your personal codes has been renewed:<br><br></div>";
                    const last_message = "<div>Please keep these codes private.<br><br> </div>\
                      <div>Thank you,</div>\
                      <div>" + req.body.restaurant.fullname + "</div>\
                      <div>" + req.body.restaurant.occupation + "</div>\
                      <div>" + req.body.restaurant.companyname + "</div>\
                      <div> +" + req.body.restaurant.countrycode + req.body.restaurant.phone + "</div>\
                      <div>" + req.body.restaurant.address + "</div>";
                    element.token = Math.floor(1000 + Math.random() * 9000);
                    updateEmployeeToken(element._id, element.token);
                    this.createQrcode(req.body.restaurant.restaurantCode, element, subject, first_message, last_message);
                }
            });
            return res.json({
                success: true,
                message: 'New codes sent to mail successfully'
            });
        }
    });
});

// used to generate/reset code for all employees 
router.post('/weakly-renewal', (req, res, next) => {
    CronTable.find({
        user_id: req.body._id
    }, function (err, data) {
        if (err) throw err;
        if (data.length == 0) {
            var newCronTable = new CronTable({
                user_id: req.body._id,
                weaklyRenewalSwitch: req.body.weaklyRenewalSwitch,
                fullname: req.body.fullname,
                occupation: req.body.occupation,
                companyname: req.body.companyname,
                address: req.body.address,
                countrycode: req.body.countrycode,
                phone: req.body.phone,
            });
            newCronTable.save(function (err, response) {
                if (err) throw err;
                this.weaklyRenew(response);
                res.json({
                    success: true
                });
            });
        } else {
            CronTable.findByIdAndUpdate(data[0]._id, {
                $set: {
                    'weaklyRenewalSwitch': req.body.weaklyRenewalSwitch
                }
            }, {
                    new: true
                })
                .then(Users => {
                    if (!Users) {
                        console.log("Data not found");
                    }
                    this.weaklyRenew(Users);
                    res.json({
                        success: true
                    });
                });
        }
    });

});

weaklyRenew = function (restaurant) {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    var nWeekDay = date.getDay();
    var nHour = date.getHours();
    var nMin = date.getMinutes();
    var notificationTime = nMin + ' ' + nHour + ' * * ' + nWeekDay;
    var task = cron.schedule(notificationTime, () => {
        if (restaurant.weaklyRenewalSwitch == 'false') {
            task.destroy();
        } else {
            Employee.find({
                user_id: restaurant.user_id
            }, function (err, data) {
                if (err) {
                    throw err;
                } else {
                    data.forEach(element => {
                        if (element.role !== 'guest') {
                            const subject = " Your personal tablet codes for this week ";
                            const first_message = "<div>Hello " + element.firstname + " " + element.lastname + ".</div>\
                      <div>Your personal tablet codes for this week:<br><br></div>";
                            const last_message = "<div>Please keep these codes private!<br><br> </div>\
                      <div>Thank you,</div>\
                      <div>" + restaurant.fullname + "</div>\
                      <div>" + restaurant.occupation + "</div>\
                      <div>" + restaurant.companyname + "</div>\
                      <div> +" + restaurant.countrycode + restaurant.phone + "</div>\
                      <div>" + restaurant.address + "</div>";
                            element.token = Math.floor(1000 + Math.random() * 9000);
                            updateEmployeeToken(element._id, element.token);
                            this.createQrcode(restaurant.restaurantCode, element, subject, first_message, last_message);
                        }

                    });
                    console.log('weakly codes renewed successfully.');
                }
            });
        }
    }); // cron function ends
}


/**
 * add menu customization
 */
createQrcode = function (restaurantCode, employee, subject, first_message, last_message, ) {
    // var secret = speakeasy.generateSecret({
    //   length: 30
    // });
    // var token = speakeasy.totp({
    //   secret: secret.base32,
    //   encoding: 'base32',
    //   window: 60
    // });

    var code = employee.token + '_' + restaurantCode;
    const encryptedString = cryptr.encrypt(code);
    const token = code;
    QRCode.toDataURL(encryptedString, function (err, data_url) {
        let base64Image = data_url.split(';base64,').pop();
        const filename = Date.now() + '.png';
        fs.writeFile(filename, base64Image, {
            encoding: 'base64'
        }, function (err) {
            // console.log('File created');
            gfs.fromFile({
                filename: filename
            }, filename, function (err, file) {
                const qrfilepath = constants.site_url + 'api/user/get-qrcode/' + file._id
                Employee.findByIdAndUpdate(employee._id, {
                    $set: {
                        'qrfileid': qrfilepath
                    }
                }, {
                        new: true
                    })
                    .then(Users => {
                        if (!Users) {
                            console.log("Employee not found with id " + employee._id);
                        }
                    });
            });
            var data = {
                from: constants.mailgun.from,
                to: employee.email,
                subject: subject,
                html: '<!DOCTYPE html>\
                    <html lang="en">\
                    <head>\
                    <meta charset="UTF-8">\
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">\
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">\
                    <title>Dinnerbell</title>\
                    </head>\
                    <body>\
                    <div> ' + first_message + ' </div>\
                    <div class="col-lg-2 col-sm-3 col-xs-6"> Passcode : ' + token + ' </div>\
                    <div class="col-lg-2 col-sm-3 col-xs-6"> QR code : </div>\
                    <img src="cid:' + filename + '" alt="QR code">\
                    <div> ' + last_message + ' </div>\
                    </body>\
                    </html>',
                inline: filename,
            };
            mailgun.messages().send(data, function (error, body) {
                if (error) {
                    console.log('Email Error : ', error);
                } else {
                    console.log('mail sent successfully : ');
                    // response.send({ success: true, message: 'Qr-Code sent to mail successfully.' })
                    fs.unlink(filename, function (err) {
                        if (err) throw err;
                        // if no error, file has been deleted successfully
                        // console.log('File deleted!');
                    });
                }
            }); // mail function ends
        });
    });
};


createGuestUser = function (restaurant) {

    var newEmployee = new Employee({
        user_id: restaurant._id,
        firstname: 'Guest',
        lastname: 'User',
        role: 'guest',
        email: 'guest@gmail.com',
        countrycode: restaurant.countrycode,
        phone: restaurant,
        country: restaurant,
        state: restaurant.state,
        city: restaurant.city,
        zipcode: restaurant.zipcode,
        streetAddress: restaurant.address,
        token: 0000
    });
    newEmployee.save(function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response)
            var code = '0000_' + restaurant.restaurantCode;
            const encryptedString = cryptr.encrypt(code);
            const token = code;
            QRCode.toDataURL(encryptedString, function (err, data_url) {
                let base64Image = data_url.split(';base64,').pop();
                const filename = Date.now() + '.png';
                fs.writeFile(filename, base64Image, {
                    encoding: 'base64'
                }, function (err) {
                    // console.log('File created');
                    gfs.fromFile({
                        filename: filename
                    }, filename, function (err, file) {
                        const qrfilepath = constants.site_url + 'api/user/get-qrcode/' + file._id
                        Employee.findByIdAndUpdate(response._id, {
                            $set: {
                                'qrfileid': qrfilepath
                            }
                        }, {
                                new: true
                            })
                            .then(Users => {
                                if (!Users) {
                                    console.log("Employee not found with id " + response._id);
                                    fs.unlink(filename, function (err) {
                                        if (err) throw err;
                                        // if no error, file has been deleted successfully
                                        // console.log('File deleted!');
                                    });
                                }

                            });
                    });
                });
            });
        }
    });


}

// used to get qrcode file for particular user with _id
router.get('/get-qrcode/:_id', (req, res, next) => {
    gfs.readFile({
        _id: req.params._id
    }, function (err, data) {
        res.set('Content-Type', 'image/png')
        res.send(data);
    });
});


// router.get('/get-create-qrcode', (req, res, next) => {
//   var text = Math.floor(10000000 + Math.random() * 90000000);
//   const encryptedString = cryptr.encrypt(text);
//   const decryptedString = cryptr.decrypt(encryptedString);
// });


router.post('/scan-qrcode', (req, res, next) => {
    const decryptedNumber = cryptr.decrypt(req.body.restaurantCode);
    const resCode = decryptedNumber.slice(5, 12);
    const empCode = decryptedNumber.slice(0, 4);
    User.findOne({
        restaurantCode: parseInt(resCode)
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            return res.json({
                success: false,
                error: 'Qr-code is invalid',
            });
        } else {
            getZipData(user, res, empCode);
        }
    });
});

router.post('/verify-qrcode', (req, res, next) => {
    const resCode = req.body.restaurantCode.slice(5, 12);
    const empCode = req.body.restaurantCode.slice(0, 4);
    User.findOne({
        restaurantCode: parseInt(resCode)
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            return res.json({
                success: false,
                error: 'Qr-code is invalid',
            });
        } else {

            getZipData(user, res, empCode);
        }
    });
});


function updateRestaurantCode(id, data) {
    User.findByIdAndUpdate(id, {
        $set: {
            'restaurantCode': data
        }
    }, {
            new: true
        }).then(Users => {
            if (!Users) {
                console.log("Data not found");
            }
            console.log('Restaurant code updated');
        });
}

function updateEmployeeToken(id, data) {
    Employee.findByIdAndUpdate(id, {
        $set: {
            'token': data
        }
    }, {
            new: true
        }).then(Users => {
            if (!Users) {
                console.log("Data not found");
            }
            console.log('Restaurant code updated');
        });
}

async function getZipData(user, res, empCode) {

    var jsonData = [];
    var obj = {};

    // find user Active theme
    var activeTheme = await ThemeActive.findOne({
        userId: user._id
    })
    if (activeTheme) {
        // find user active theme settings
        let settingTheme = await ThemeSetting.findOne({
            "userId": activeTheme.userId, "name": activeTheme.name
        })

        obj['ThemeSettings'] = settingTheme;
    }

    let restaurantInfo = {
        restaurantName: user.companyname,
        restaurantCode: user.restaurantCode,
        ownerName: user.fullname,
        ownerEmail: user.email,
        country: user.country,
        city: user.city,
        state: user.state,
        address: user.address,
        zipcode: user.zipcode,
        website: user.website,
        phone: '+' + user.countrycode + '-' + user.phone,
    }
    obj['RestaurantData'] = restaurantInfo;

    await Employee.find({
        user_id: user._id
    }, async function (err, data) {
        if (err) {
            return res.json({
                success: false,
                data: 'User not found'
            });
        } else {
            if (data.length) {
                var employees = await Employee.findOne({
                    user_id: user._id,
                    token: empCode
                });
                if (employees.role == 'guest') {
                    obj['EmployeeData'] = employees;
                } else {
                    const email = employees.email;
                    const empToken = employees.token;
                    const token = jwt.sign({ email, empToken }, constants.jwt.JWT_ENCRYPTION, {
                        expiresIn: constants.jwt.JWT_EXPIRATION
                    });
                    let dataToreturn = {
                        ...employees._doc,
                        empToken: token
                    }
                    obj['LoggedIn'] = dataToreturn;
                    // jsonData.push(dataToreturn);
                }


            }
        }
    });

    await IngredientCategory.find({
        user_id: user._id
    }, async function (err, data) {
        if (err) {
            obj['IngredientCategory'] = [];
        } else {
            var ingredientData = [];
            if (data.length) {
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    var items = await Ingredient.find({
                        company_id: element.company_id
                    });
                    let dataToSave = {
                        category: element,
                        categoryItems: items
                    }
                    ingredientData.push(dataToSave);
                }
                // let dataToreturn = {
                //     IngredientCategory: ingredientData
                // }
                obj['IngredientCategory'] = ingredientData;
                //jsonData.push(dataToreturn);
            }
        }
    });

    await Menu.find({
        user_id: user._id
    }, async function (err, data) {
        if (err) {
            obj['Menus'] = [];
        } else {
            var menusData = [];
            if (data.length) {
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    var menuitems = await MenuItem.find({
                        menu_id: element._id
                    });
                    let dataToSave = {
                        menu: element,
                        menuItems: menuitems
                    }
                    menusData.push(dataToSave);
                }
                // let dataToreturn = {
                //     Menus: menusData
                // }
                obj['Menus'] = menusData;
                jsonData.push(obj);
                // return res.json({
                //     success: false,
                //     data: jsonData
                // });
                // jsonData.push(dataToreturn);
                //console.log(JSON.stringify(jsonData));
                const filename = Date.now() + '.json';
                fs.writeFile(filename, JSON.stringify(jsonData), 'utf8', function(err) {
                    var zip = new AdmZip();
                    zip.addLocalFile(filename);
                    deleteFile(filename);
                    const zipfilename = Date.now() + '.zip';
                    zip.writeZip(zipfilename);
                    saveFile(zipfilename, res);
                    deleteFile(zipfilename);
                });
            }
        }
    });

}


function saveFile(filename, res) {
    gfs.fromFile({
        filename: filename
    }, filename, function (err, file) {
        const zipfilepath = constants.site_url + 'api/user/get-zipFile/' + file._id
        res.send({
            success: true,
            zipFileLink: zipfilepath
        });

    });
}

function deleteFile(filename) {
    fs.unlink(filename, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
}

// used to get qrcode file for particular user with _id
router.get('/get-zipFile/:_id', (req, res, next) => {
    gfs.readFile({
        _id: req.params._id
    }, function (err, data) {
        res.set('Content-Type', 'application/zip')
        res.send(data);
    });
});

module.exports = router;