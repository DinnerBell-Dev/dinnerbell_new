var express = require('express');
var router = express.Router();
var Admin = require("../models/admin");
var User = require("../models/user");
var constants = require("../config/constants");
var ObjectId = require('mongoose').Types.ObjectId;
var IngredientCategory = require("../models/ingredient_category");
var Ingredient = require("../models/ingredient");
const ThemeAdd = require('../models/theme_add');
const ThemeSetting = require('../models/theme_setting');
const ThemeActive = require('../models/theme_active');
const AdminThemeSetting = require('../models/admintheme_setting');
/**
 * To perfom admin registration
 */
router.post('/signup', function (req, res) {
    if (!req.body.password || !req.body.email) {
        return res.json({
            success: false,
            error: constants.errors.user.invalid_params
        });
    }
    Admin.findOne({
        'email': new RegExp('^' + req.body.email + '$', "i")
    }, function (err, user) {

        if (user) {
            return res.json({
                success: false,
                error: constants.errors.user.duplicated_email,
                email: req.body.email
            });
        } else {

            var newUser = new Admin({
                email: req.body.email,
                password: req.body.password,
            });

            newUser.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.json({
                        success: false,
                        msg: 'Username already exists.'
                    });
                }
                return res.json({
                    success: true,
                    user: {
                        email: newUser.email,
                    },
                    message: 'Admin registered successfully'
                });

            });
        }
    });

});

/**
 * To perfom admin login
 */
router.post('/signin', function (req, res) {

    Admin.findOne({
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
 * To find all admin users
 */
router.get('/users', function (req, res) {
    Admin.find()
        .then(Users => {
            res.send(Users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
});

/**
 * To delete admin user based on id
 */
router.delete('/users/:usersId', function (req, res) {

    Admin.findByIdAndRemove(req.params.usersId)
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Admin user not found with id " + req.params.usersId
                });
            }
            res.send({
                message: "Admin user deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Admin user not found with id " + req.params.usersId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.usersId
            });
        });
});

/**
 * To get admin user based on id
 */

router.get('/users/:usersId', function (req, res) {

    Admin.findById(req.params.usersId)
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Admin users not found with id " + req.params.usersId
                });
            }
            res.send(Users);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Admin user not found with id " + req.params.usersId
                });
            }
            return res.status(500).send({
                message: "Error retrieving admin users with id " + req.params.usersId
            });
        });
});

/**
 * Admin api to create new ingredient category.
 */
router.post('/registerIngredientCategory', function (req, res) {
    let newCategory = new IngredientCategory()
    newCategory.name = req.body.name
    newCategory.createdbyAdmin = true
    newCategory.photo_url = req.body.photo_url
    newCategory.photo_name = req.body.photo_name
    newCategory.company_id = new ObjectId(req.body.company_id)
    newCategory.ingredients = []

    newCategory.save((err) => {
        if (err) {
            return res.json({ success: false, error: constants.errors.server_error })
        } else {
            return res.json({ success: true, message: 'Category created successfully.' });
        }
    })
});

/**
 * Admin api to update ingredient category
 */
router.put('/updateIngredientCategory/:catId', function (req, res) {

    IngredientCategory.findByIdAndUpdate(req.params.catId, req.body, { new: true })
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Ingredient category not found with id " + req.params.catId
                });
            }
            res.send({ success: true, user: Users });

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
 * To get all ingredient category
 */
router.get('/getAllIngredientsCategory', function (req, res) {
    IngredientCategory.find({}, function (err, data) {

        if (!err) {
            return res.json({ success: true, data: data });
        }
    })
});

/**
 * To get all ingredient category based on createdbyAdmin field
 */
router.get('/getIngredientCategories', function (req, res) {
    IngredientCategory.find({
        createdbyAdmin: true
    }, function (err, data) {
        if (err) {
            return res.json({ success: false, error: 'Data not found' });
        } else {
            return res.json({ success: true, data: data });
        }

    });
});


/**
 * To delete ingredient category
 */
router.delete('/ingredientcategory/:catId', function (req, res) {

    IngredientCategory.findByIdAndRemove(req.params.catId)
        .then(resdata => {
            if (!resdata) {
                return res.status(404).send({
                    message: "Ingredient category not found with id " + req.params.catId
                });
            }
            res.send({
                message: "Ingredient category deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Ingredient category not found with id " + req.params.catId
                });
            }
            return res.status(500).send({
                message: "Could not delete ingredient category with id " + req.params.catId
            });
        });
});

/**
 * Api used to create ingredient.
 */
router.post('/registerIngredient', function (req, res) {

    let newIngredient = new Ingredient()
    newIngredient.name = req.body.name
    newIngredient.description = req.body.description
    newIngredient.photo_url = req.body.photo_url
    newIngredient.photo_name = req.body.photo_name
    newIngredient.price = req.body.price
    newIngredient.label = req.body.label
    // newIngredient.label = req.body.label == '' ? new ObjectId(req.body.label) : null
    newIngredient.company_id = new ObjectId(req.body.company_id)
    let category_id = new ObjectId(req.body.category_id);

    newIngredient.save((err, ingredientdata) => {
        if (err) {
            return res.json({ success: false, error: constants.errors.server_error })
        } else {
            let ingredientCategory = IngredientCategory.findOne({ _id: category_id }, (err, category) => {
                category.ingredients.push(ingredientdata);
                category.save((err) => {
                    if (err) {
                        // return res.json({ success: false, error: constants.errors.server_error });
                        return res.json({ success: false, error: err });
                    } else {
                        return res.json({ success: true, data: newIngredient });
                    }
                })
            })
        }
    })

});


// get ingredients based on category or company id of category
router.get('/getAllIngredients/:company_id', function (req, res) {
    Ingredient.find({ company_id: new ObjectId(req.params.company_id) }).then((datares, err) => {
        if (err) {
            return res.json({ success: false, error: err })
        } else {
            return res.json({ success: true, data: datares })
        }

    })
});

/**
 *  get ingredients based on category or company id of category
 */
router.get('/getAllIngredients', function (req, res) {
    Ingredient.find().then((datares, err) => {
        if (err) {
            return res.json({ success: false, error: err })
        } else {
            return res.json(datares);
        }
    })
});

/**
 * Admin api to update ingredient category item
 */
router.put('/updateIngredientCategoryItem/:itemId', function (req, res) {

    Ingredient.findByIdAndUpdate(req.params.itemId, req.body, { new: true })
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Ingredient item not found with id " + req.params.itemId
                });
            }
            res.send({ success: true, ingredient: Users });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Ingredient item not found with id " + req.params.itemId
                });
            }
            return res.status(500).send({
                message: "Error retrieving ingredient item with id " + req.params.itemId
            });
        });
});

/**
 * To delete ingredient category item
 */
router.delete('/ingredientcategoryItem/:itemId', function (req, res) {

    Ingredient.findByIdAndRemove(req.params.itemId)
        .then(resdata => {
            if (!resdata) {
                return res.status(404).send({
                    message: "Ingredient not found with id " + req.params.itemId
                });
            }
            res.send({
                message: "Ingredient deleted successfully!",
                result: resdata
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Ingredient not found with id " + req.params.itemId
                });
            }
            return res.status(500).send({
                message: "Could not delete ingredient with id " + req.params.itemId
            });
        });
});
/**
 * Add new theme by admin
 */
router.post('/theme-add', async (req, res, next) => {
    try {
        // user find by id
        const user = await Admin.findById(req.body.adminId);
        if (!user) {
            return res.status(404).send({
                sucess: false,
                message: 'Not found!',
                data: null,
            })
        }
        // add theme

        const themeName = await ThemeAdd.findOne({ "name": req.body.name }).exec();
        if (themeName) {
            return res.status(200).send({
                sucess: false,
                message: 'Theme name already exist!',
            })
        }

        const newTheme = new ThemeAdd(req.body);
        var result = await newTheme.save();
        // theme add successfully



        // Theme  default settings insert
        // const users = await User.find();
        // for(let item in users){
        //     req.body.themeId = result.id;
        //     req.body.userId = users[item].id;
        //     req.body.name = result.name;
        //     const newThemeSettings = new ThemeSetting(req.body);
        //     const result2 = await newThemeSettings.save();
        // }
        // setting find by id
        const setting = await AdminThemeSetting.findById(req.body.Id);
        let results;
        if (!setting) {
            // setting insert
            req.body.themeId = result.id;
            req.body.userId = req.body.adminId;
            req.body.name = result.name;
            let newSetting = new AdminThemeSetting(req.body);
            results = await newSetting.save();
            // return res.status(200).send({
            //     sucess: true,
            //     message: 'Theme setting insert successfully!',
            //     data: result,
            // })
        }
        data = { ...results['_doc'], photo_url: result.photo_url };
        res.status(200).send({
            sucess: true,
            message: 'Theme add successfully!',
            data: data

        })


    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        });
    }
});


/**
 * Admin Theme setting list
 */
router.post('/theme-list', async (req, res, next) => {
    try {
        const result = await ThemeAdd.findOne({ "name": req.body.name });
        const setting = await AdminThemeSetting.findOne({ "name": req.body.name });
        data = { ...setting['_doc'], photo_url: result.photo_url };
        res.status(200).send({
            success: true,
            data: data,
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        });
    }
});
/**
 * update theme by admin
 */
router.post('/theme-update', async (req, res, next) => {
    try {


        // user find by id
        const user = await Admin.findById(req.body.userId);
        if (!user) {
            return res.status(404).send({
                sucess: false,
                message: 'Not found!',
                data: null,
            })
        }

        // setting update
        const settingUpdate = await AdminThemeSetting.findByIdAndUpdate({
            _id: req.body.Id
        }, req.body, { new: true }).exec();


        // theme update 
        const checkTheme = await ThemeAdd.findById(req.body.themeId);
        if (req.body.hasOwnProperty('name') && req.body.hasOwnProperty('photo_url')) {
            
            if (checkTheme) {
                var updateTheme = await ThemeAdd.findByIdAndUpdate({
                    _id: req.body.themeId
                }, { $set: { name: req.body.name, photo_url: req.body.photo_url } }, { new: true }).exec();
            }
        }
        data = { ...settingUpdate['_doc'], photo_url: checkTheme.photo_url };
        res.status(200).send({
            sucess: true,
            message: 'Theme setting update successfully!',
            data: data,
        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        });
    }
});


/**
 * All themes get
 */
router.get('/theme', async (req, res, next) => {
    try {
        const theme = await ThemeAdd.find();
        res.status(200).send({
            success: true,
            data: theme
        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        })
    }
});
/**
 * Delete theme
 */
router.delete('/theme-delete/:id', async (req, res)=> {

    try{
        const themeAdd =  await ThemeAdd.findByIdAndRemove(req.params.id);
        if (!themeAdd) {
            return res.status(404).send({
                message: "Theme not found with id " + req.params.id
            });
        }
        const themeActive =  await ThemeActive.find({themeId:req.params.id}).remove().exec();
        const themeAdmin =  await AdminThemeSetting.find({themeId:req.params.id}).remove().exec();
        const themeSetting =  await ThemeSetting.find({themeId:req.params.id}).remove().exec();

        res.send({
            message: "Theme deleted successfully!",
            result: themeAdd
        });
       }catch(err){
         res.status(500).send({
             success:false,
             message:err.toString()
         })
       }
});
module.exports = router;