var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../../config/database');
require('../../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var ObjectId = require('mongoose').Types.ObjectId;
var User = require("../../models/user");
var constants = require("../../config/constants");
var Restaurant = require("../../models/restaurant");
var IngredientCategory = require("../../models/ingredient_category");
var Ingredient = require("../../models/ingredient");
var Employee = require("../../models/employee");
var IngredientLabel = require("../../models/ingredient_label");
var FoodLabel = require("../../models/food_label");
var MainMenu = require("../../models/main_menu")
var SubMenu = require("../../models/sub_menu")
var Menu = require("../../models/menu")


var mailgun = require('mailgun-js')({ apiKey: constants.mailgun.api_key, domain: constants.mailgun.DOMAIN });

var multer = require('multer')
var ingredientUpload = multer({ dest: 'public/ingredient_photos/' })
var menuUpload = multer({ dest: 'public/menu_photos/' })

router.post('/load_all_user', function(req, res) {
    User.find({}).select('-__v').populate({ path: 'company_id' }).exec(function(err, users) {
        return res.json({ success: true, data: { user: users } })
    });
});
router.post('/load_employees', function(req, res) {
    Employee.find({ company_id: new ObjectId(req.body.company_id) }).select('-__v').exec(function(err, employees) {
        return res.json({ success: true, data: { employees: employees } })
    });
})
router.post('/getCompanyInfo', function(req, res) {
    let company_id = req.body.company_id
    Restaurant.findOne({ _id: new ObjectId(company_id) }).select('-__v').populate({ path: 'company_id' }).exec(function(err, data) {
        return res.json({ success: true, data: { company_data: data } })
    });
});
router.post('/update_employee', function(req, res) {
    let company_id = req.body.company_id
    let employee = req.body.employee
    console.log(company_id)
    if (employee._id != -1) {
        Employee.findByIdAndUpdate(employee._id, employee, { new: true }, (err, employee) => {
            // Handle any possible database errors
            if (err) {
                return res.json({
                    success: false,
                    error: constants.errors.server_error
                });
            } else {
                return res.json({ success: true, data: { newemployee: employee } })
            }
        })
    } else {
        const newE = new Employee();
        newE.name = employee.name
        newE.role = employee.role
        newE.company_id = new ObjectId(company_id)
        newE.save(err => {
            if (err) {
                return res.json({
                    success: false,
                    error: constants.errors.server_error
                });
            } else {
                return res.json({ success: true, data: { newemployee: newE } })
            }

        });
    }
});
router.post('/remove_employee', function(req, res) {
    Employee.findByIdAndRemove(req.params.employee_id, (err, todo) => {
        // As always, handle any potential errors:
        if (err) {
            return res.json({ success: false, error: constants.errors.server_error });
        } else {
            return res.json({ success: true, data: {} })
        }
    });
})
router.post('/change_user_status', function(req, res) {
    let user_id = req.body.user_id
    let status = req.body.status

    User.findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { status: status } }, { new: true }, function(err, user) {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            });
        } else {
            Restaurant.findOne({ _id: new ObjectId(user.company_id) }, function(err, companyinfo) {

                if (err || !companyinfo) {
                    return res.json({
                        success: false,
                        error: constants.errors.server_error
                    });
                } else {
                    return res.json({
                        success: true,
                        data: {}
                    });
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

        mailgun.messages().send(data, function(error, body) {
            console.log(body);
        });
    }
});
router.post('/saveCompanyInfo', function(req, res) {
    let company_id = req.body.company_id
    let new_company_data = req.body.new_company_data

    Restaurant.findOneAndUpdate({ _id: new ObjectId(company_id) }, { $set: new_company_data }, { new: true }, function(err, user) {
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
});
// ingredients
router.post('/getIngredientCategory', function(req, res) {
    let company_id = req.body.company_id

    IngredientCategory.find({ company_id: new ObjectId(company_id) }, (err, categories) => {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            })
        } else {
            return res.json({
                success: true,
                data: {
                    ingredient_categories: categories
                }
            });
        }

    })
});
router.post('/getIngredients', function(req, res) {
    let category_id = req.body.category_id
    IngredientCategory.findOne({ _id: new ObjectId(category_id) }).populate({ path: 'ingredients', select: '-__v -company_id', populate: { path: 'label', select: '-__v -company_id' } }).exec((err, inredientCategorie) => {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            })
        } else {
            if (!inredientCategorie) {
                data = {
                    ingredients: []
                }
            } else {
                data = {
                    ingredients: inredientCategorie.ingredients
                }
                data.ingredients.forEach(function(element) {
                    element.photo_url = `${constants.base_url}/ingredient_photos/${element.photo_url}`
                }, this);
            }
            return res.json({
                success: true,
                data: data
            });
        }

    });
});
router.post('/getAllIngredients', function(req, res) {
    let company_id = req.body.company_id
    IngredientCategory.find({ company_id: new ObjectId(company_id) }).populate({ path: 'ingredients', select: '-__v -company_id', populate: { path: 'label', select: '-__v -company_id' } }).exec((err, ingredientdata) => {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            })
        } else {
            if (!ingredientdata) {
                data = {
                    ingredients: []
                }
            } else {
                data = {
                    ingredients: ingredientdata
                }
                data.ingredients.forEach(function(ingredientcategory) {
                    ingredientcategory.ingredients.forEach(function(ingredient) {
                        ingredient.photo_url = `${constants.base_url}/ingredient_photos/${ingredient.photo_url}`
                    }, this);
                }, this);
            }
            return res.json({
                success: true,
                data: data
            });
        }

    });
});
router.post('/registerIngredientCategory', function(req, res) {
    let newCategory = new IngredientCategory()
    console.log(req.body)
    newCategory.name = req.body.name
    newCategory.photo_url = req.body.photo_url
    newCategory.company_id = new ObjectId(req.body.company_id)
    newCategory.ingredients = []
    newCategory.save((err) => {
        if (err) {
            return res.json({ success: false, error: constants.errors.server_error })
        } else {
            return res.json({ success: true, data: { newCategory: newCategory } })
        }
    })
})
router.post('/registerIngredient', function(req, res) {
    let newParams = req.body.newingredient
    console.log(newParams)
    let newIngredient = new Ingredient()
    newIngredient.title = newParams.title
    newIngredient.price = newParams.price
    newIngredient.photo_url = newParams.photo_url
    newIngredient.label = newParams.label == '' ? new ObjectId(newParams.label) : null
    newIngredient.company_id = new ObjectId(newParams.company_id)
    let category_id = new ObjectId(newParams.category_id)

    newIngredient.save((err) => {
        if (err) {
            return res.json({ success: false, error: constants.errors.server_error })
        } else {
            let ingredientCategory = IngredientCategory.findOne({ _id: category_id }, (err, category) => {
                category.ingredients.push(newIngredient)
                category.save((err) => {
                    if (err) {
                        return res.json({ success: false, error: constants.errors.server_error })
                    } else {
                        newIngredient.photo_url = `${constants.base_url}/ingredient_photos/${newIngredient.photo_url}`
                        return res.json({ success: true, data: { newIngredient: newIngredient } })
                    }
                })
            })
        }
    })
})
router.post('/getIngredientLabels', function(req, res) {
    let company_id = req.body.company_id

    IngredientLabel.find({ company_id: new ObjectId(company_id) }, (err, ingredientlabels) => {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            })
        } else {
            return res.json({
                success: true,
                data: {
                    labels: ingredientlabels
                }
            });
        }
    })
})
router.post('/getFoodLabels', function(req, res) {
    let company_id = req.body.company_id

    FoodLabel.find({ company_id: new ObjectId(company_id) }, (err, labels) => {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            })
        } else {
            return res.json({
                success: true,
                data: {
                    labels: labels
                }
            });
        }
    })
})
router.post('/uploadingredientfile', ingredientUpload.single('image'), function(req, res, next) {
    const data = req.file;
    res.send({ fileName: data.filename, originalName: data.originalname });
})
router.post('/uploadmenufile', menuUpload.single('image'), function(req, res, next) {
        const data = req.file;
        res.send({ fileName: data.filename, originalName: data.originalname });
    })
    // menu
router.post('/getMainMenu', function(req, res) {
    let company_id = req.body.company_id
    MainMenu.find({ company_id: new ObjectId(company_id) }, (err, mainMenues) => {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            })
        } else {
            return res.json({
                success: true,
                data: {
                    mainMenues: mainMenues
                }
            });
        }

    })
})
router.post('/registerMainMenu', function(req, res) {
    let newMainMenu = new MainMenu()

    newMainMenu.name = req.body.newMainMenu.name
    newMainMenu.company_id = new ObjectId(req.body.newMainMenu.company_id)
    newMainMenu.from_at = req.body.newMainMenu.from_at
    newMainMenu.to_at = req.body.newMainMenu.to_at
    newMainMenu.submenus = req.body.newMainMenu.submenus
    newMainMenu.save((err) => {
        if (err) {
            return res.json({ success: false, error: constants.errors.server_error })
        } else {
            return res.json({ success: true, data: { newMainMenu: newMainMenu } })
        }
    })
})
router.post('/getSubMenus', function(req, res) {
    let mainmenu_id = req.body.mainmenu_id
    MainMenu.findOne({ _id: new ObjectId(mainmenu_id) }).populate({ path: 'submenus', select: '-__v -company_id', populate: { path: 'menus', select: '-__v -company_id', populate: { path: 'details.label', select: '-__v -company_id' } } }).exec((err, menus) => {
        if (err) {
            return res.json({
                success: false,
                error: constants.errors.server_error
            })
        } else {
            if (!menus) {
                data = {
                    subMenues: []
                }
            } else {
                data = {
                    subMenues: JSON.parse(JSON.stringify(menus.submenus))
                }
                data.subMenues.forEach(function(onesubmenu) {
                    onesubmenu.menus.forEach(function(onemenu) {
                        onemenu.details.photo_urls.forEach(function(photo, index, arrPhotos) {
                            arrPhotos[index] = `${constants.base_url}/food_photos/${photo}`
                        })
                    })
                }, this);
            }
            return res.json({
                success: true,
                data: data
            });
        }

    });
});
router.post('/registerSubMenu', function(req, res) {
    let newParams = req.body.newSubMenu
    let newSubMenu = new SubMenu()
    newSubMenu.name = newParams.name
    newSubMenu.menus = newParams.menus
    newSubMenu.company_id = new ObjectId(newParams.company_id)
    let mainmenu_id = new ObjectId(req.body.mainmenu_id)

    newSubMenu.save((err) => {
        if (err) {
            return res.json({ success: false, error: constants.errors.server_error })
        } else {
            let mainMenuOfSub = MainMenu.findOne({ _id: mainmenu_id }, (err, mainmenu) => {
                mainmenu.submenus.push(newSubMenu)
                mainmenu.save((err) => {
                    if (err) {
                        return res.json({ success: false, error: constants.errors.server_error })
                    } else {
                        return res.json({ success: true, data: { newSubMenu: newSubMenu } })
                    }
                })
            })
        }
    })
})
router.post('/registerMenu', function(req, res) {

    let newParams = req.body.newmenu


    // newParams.company_id = new ObjectId(newParams.company_id)
    // for (let i = 0; i < newParams.ingredients.length; i++) {
    //   newParams.ingredients[i] = new ObjectId(newParams.ingredients[i])
    // }
    // newParams.details.label = new ObjectId(newParams.details.label)
    // for (let i = 0; i < newParams.categories.length; i++) {
    //   newParams.categories[i].mainmenu = new ObjectId(newParams.categories[i].mainmenu)
    //   newParams.categories[i].submenu = new ObjectId(newParams.categories[i].submenu)
    // }
    let newmenu = new Menu(newParams)
    newmenu.save((err) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, error: constants.errors.server_error })
        } else {
            newParams.categories.forEach(function(category) {
                let submenu_id = category.submenu
                SubMenu.findOne({ _id: new ObjectId(submenu_id) }, function(err, submenu) {

                    if (!err && submenu) {
                        submenu.menus.push(newmenu)
                        submenu.save()
                    }
                })
            }, this);
            return res.json({ success: true, data: { newmenu: newmenu } })
        }
    })
})
getToken = function(headers) {
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

router.get('/getAllIngredientsCategory', function(req, res) {
    IngredientCategory.find({}, function(err, data) {

        if (!err) {
            return res.json({ success: true, data: data });
        }
    })
});



module.exports = router;