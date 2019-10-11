const express = require('express');
const ThemeSetting = require('../models/theme_setting');
const ThemeActive = require('../models/theme_active');
const User = require('../models/user');
const router = express.Router();
const ThemeAdd = require('../models/theme_add');
const AdminThemeSetting = require('../models/admintheme_setting');
/**
 * Theme setting insert&update 
 */
router.post('/', async (req, res, next) => {
    try {
        // user find by id
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send({
                sucess: false,
                message: 'Not found!',
                data: null,
            })
        }
        // setting find by id
        // const setting = await ThemeSetting.findById(req.body.themeId);
        // if (!setting) {
        //     // setting insert
        //     const newSetting = new ThemeSetting(req.body);
        //     const result = await newSetting.save();
        //     return res.status(200).send({
        //         sucess: true,
        //         message: 'Theme setting insert successfully!',
        //         data: result,
        //     })
        // }
        // setting update
        const settingUpdate = await ThemeSetting.findByIdAndUpdate({
            _id: req.body.Id
        }, req.body, { new: true }).exec();
        res.status(200).send({
            sucess: true,
            message: 'Theme setting update successfully!',
            data: settingUpdate,
        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        });
    }
});




/**
 * Theme setting list get by user id
 */
router.post('/list', async (req, res, next) => {
    try {
        const setting = await ThemeSetting.findOne({ "userId": req.body.userId, "themeId": req.body.name });
        res.status(200).send({
            success: true,
            data: setting
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
router.get('/theme-list', async (req, res, next) => {
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
 * Theme active add & update
 */

router.post('/active', async (req, res, next) => {
    try {
        // user find by id
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send({
                sucess: false,
                message: 'Not found!',
                data: null,
            })
        }
        // check active theme
        const checkActive = await ThemeActive.findOne({ userId: req.body.userId });
        if (!checkActive) {
            // add theme
            const newThemeactive = new ThemeActive(req.body);
            const result = await newThemeactive.save();
            const theme = await ThemeAdd.findById(result.themeId);
            data = { ...newThemeactive['_doc'], name: theme.name};
            return res.status(200).send({
                sucess: true,
                message: 'Theme active successfully!',
                data: data,
            })
        }
        // active theme update
        const activethemeUpdate = await ThemeActive.findOneAndUpdate({
            userId: req.body.userId
        }, req.body, { new: true }).exec();
        res.status(200).send({
            sucess: true,
            message: 'Theme active update successfully!',
            data: activethemeUpdate,
        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        });
    }
});

/**
 * add default theme settings 
 */
router.post('/update', async (req, res, next) => {
    try {
        // user find by id
        //const theme = await ThemeAdd.find({});
        const theme = await AdminThemeSetting.find({});

        for (let item in theme) {
            const setting = await ThemeSetting.count({ themeId: theme[item].themeId, userId: req.body.userId });
            if (setting == 0) {
                const newThemeSettings = new ThemeSetting();
                newThemeSettings.userId = req.body.userId;
                newThemeSettings.themeId = theme[item].themeId;
                newThemeSettings.name = theme[item].name;
                newThemeSettings.baseSetting = theme[item].baseSetting;
                newThemeSettings.feedbackSetting = theme[item].feedbackSetting;
                newThemeSettings.mainMenu = theme[item].mainMenu;
                newThemeSettings.introSetting = theme[item].introSetting;
                newThemeSettings.itemDetailSetting = theme[item].itemDetailSetting;
                newThemeSettings.menuItemSetting = theme[item].menuItemSetting;
                newThemeSettings.orderSetting = theme[item].orderSetting;
                const result2 = await newThemeSettings.save();
            }

        }
        res.status(200).send({
            sucess: true,
            data: theme,
        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        });
    }
});

/**
 * restore default theme settings 
 */
router.post('/restore', async (req, res, next) => {
    try {
        const theme = await AdminThemeSetting.findOne({ themeId: req.body.themeId });
        if (!theme) {
            return res.status(200).send({
                sucess: false,
                data: 'Theme not found!',
            })
        }
        //const setting = await ThemeSetting.count({ themeId: theme.themeId, userId: req.body.userId });
        let data = {
            $set: {
                baseSetting: theme.baseSetting,
                feedbackSetting: theme.feedbackSetting,
                mainMenu: theme.mainMenu,
                introSetting: theme.introSetting,
                itemDetailSetting: theme.itemDetailSetting,
                menuItemSetting: theme.menuItemSetting,
                orderSetting: theme.orderSetting,
            }
        }
 
        const settingUpdate = await ThemeSetting.findOneAndUpdate({
            themeId: req.body.themeId, userId: req.body.userId
        }, data, { new: true }).exec();

        // if (setting == 1) {
        //     const newThemeSettings = new ThemeSetting();
        //     newThemeSettings.userId = req.body.userId;
        //     newThemeSettings.themeId = theme.themeId;
        //     newThemeSettings.name = theme.name;
        //     newThemeSettings.baseSetting = theme.baseSetting;
        //     newThemeSettings.feedbackSetting = theme.feedbackSetting;
        //     newThemeSettings.mainMenu = theme.mainMenu;
        //     newThemeSettings.introSetting = theme.introSetting;
        //     newThemeSettings.itemDetailSetting = theme.itemDetailSetting;
        //     newThemeSettings.menuItemSetting = theme.menuItemSetting;
        //     newThemeSettings.orderSetting = theme.orderSetting;
        //     const result = await newThemeSettings.save();
        // }
        res.status(200).send({
            sucess: true,
            message: 'Theme restore successfully!',
            data:settingUpdate

        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        });
    }
});

/**
 * Theme active list get by userid
 */
router.get('/active/:id', async (req, res, next) => {
    try {
        const activeTheme = await ThemeActive.findOne({ userId: req.params.id });
        const theme = await ThemeAdd.findById(activeTheme.themeId);
        data = { ...activeTheme['_doc'], name: theme.name};
        res.status(200).send({
            success: true,
            data: data
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString()
        });
    }
});
module.exports = router;