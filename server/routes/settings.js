var express = require('express');
var router = express.Router();
var Intro = require("../models/settings/intro");
var Base = require("../models/settings/base");
var Feedback = require("../models/settings/feedback");
var MenuItems = require("../models/settings/menu_items");
var MainMenuSettings = require("../models/settings/main_menu_settings");


// used to add intro settings
router.post('/add-intro', (req, res, next) => {
    if (req.body.slideShow.length < 6) {
        Intro.find({
            user_id: req.body.user_id
        }, function(err, data) {
            if (err) throw err;
            if (data.length > 0) {
                Intro.findByIdAndUpdate(data[0]._id, req.body, { new: true })
                    .then(Users => {
                        if (!Users) {
                            return res.status(404).send({
                                success: false,
                                message: 'Something went wrong'
                            });
                        }
                        res.send({ success: true, data: Users });
                    })
            } else {
                var newIntro = new Intro({
                    user_id: req.body.user_id,
                    slideShow: req.body.slideShow,
                    static_image: req.body.static_image,
                    videoInto: req.body.videoInto
                });
                newIntro.save(function(err, response) {
                    if (err) throw err;
                    res.json({ success: true, data: response });
                });
            }
        });

    } else {
        res.json({ success: false, message: 'maximum 5 images allowed' });
    }
});
// used to get intro settings
router.get('/get-intro/:user_id', (req, res, next) => {
    Intro.find({
        user_id: req.params.user_id
    }, function(err, data) {
        if (err) throw err;
        res.send({ success: true, data: data });
    });
});

// used to add base settings
router.post('/add-base', (req, res, next) => {
    Base.find({
        user_id: req.body.user_id
    }, function(err, data) {
        if (err) throw err;
        if (data.length > 0) {
            Base.findByIdAndUpdate(data[0]._id, req.body, { new: true })
                .then(Users => {
                    if (!Users) {
                        return res.status(404).send({
                            success: false,
                            message: 'Something went wrong'
                        });
                    }
                    res.send({ success: true, data: Users });
                })
        } else {
            var newBase = new Base({
                user_id: req.body.user_id,
                base_theme: req.body.base_theme,
                font_set: req.body.font_set,
                header_color: req.body.header_color,
                sub_header_color: req.body.sub_header_color,
                body_color: req.body.body_color,
                nav_bar_color: req.body.nav_bar_color,
                select_highlight_color: req.body.select_highlight_color,
                goback_color: req.body.goback_color,
                ui_neutral_color: req.body.ui_neutral_color,
                alert_color: req.body.alert_color,
                currency: req.body.currency,
                price_format: req.body.price_format
            });
            newBase.save(function(err, response) {
                if (err) throw err;
                res.json({ success: true, data: response });
            });
        }
    });
});
// used to get base settings
router.get('/get-base/:user_id', (req, res, next) => {
    Base.find({
        user_id: req.params.user_id
    }, function(err, data) {
        if (err) throw err;
        res.send({ success: true, data: data });
    });
});

// used to add feedback settings
router.post('/add-feedback', (req, res, next) => {
    Feedback.find({
        user_id: req.body.user_id
    }, function(err, data) {
        if (err) throw err;
        if (data.length > 0) {
            Feedback.findByIdAndUpdate(data[0]._id, req.body, { new: true })
                .then(Users => {
                    if (!Users) {
                        return res.status(404).send({
                            success: false,
                            message: 'Something went wrong'
                        });
                    }
                    res.send({ success: true, data: Users });
                })
        } else {
            var newFeedback = new Feedback({
                user_id: req.body.user_id,
                background_image: req.body.background_image,
                excellent_color: req.body.excellent_color,
                very_good_color: req.body.very_good_color,
                good_color: req.body.good_color,
                not_good_color: req.body.not_good_color,
                bad_color: req.body.bad_color,
                margin_top: req.body.margin_top
            });
            newFeedback.save(function(err, response) {
                if (err) throw err;
                res.json({ success: true, data: response });
            });
        }
    });
});
// used to get feedback settings
router.get('/get-feedback/:user_id', (req, res, next) => {
    Feedback.find({
        user_id: req.params.user_id
    }, function(err, data) {
        if (err) throw err;
        res.send({ success: true, data: data });
    });
});

// used to add menuitems settings
router.post('/add-menuitems', (req, res, next) => {
    MenuItems.find({
        user_id: req.body.user_id
    }, function(err, data) {
        if (err) throw err;
        if (data.length > 0) {
            MenuItems.findByIdAndUpdate(data[0]._id, req.body, { new: true })
                .then(Users => {
                    if (!Users) {
                        return res.status(404).send({
                            success: false,
                            message: 'Something went wrong'
                        });
                    }
                    res.send({ success: true, data: Users });
                })
        } else {
            var newMenuItems = new MenuItems({
                user_id: req.body.user_id,
                background_image: req.body.background_image,
                sectionHeader_size: req.body.sectionHeader_size,
                subSection_size: req.body.subSection_size,
                itemTitle_size: req.body.itemTitle_size,
            });
            newMenuItems.save(function(err, response) {
                if (err) throw err;
                res.json({ success: true, data: response });
            });
        }
    });
});
// used to get menuitems settings
router.get('/get-menuitems/:user_id', (req, res, next) => {
    MenuItems.find({
        user_id: req.params.user_id
    }, function(err, data) {
        if (err) throw err;
        res.send({ success: true, data: data });
    });
});

// used to add mainmenu settings
router.post('/add-mainmenu-settings', (req, res, next) => {
    MainMenuSettings.find({
        user_id: req.body.user_id
    }, function(err, data) {
        if (err) throw err;
        if (data.length > 0) {
            MainMenuSettings.findByIdAndUpdate(data[0]._id, req.body, { new: true })
                .then(Users => {
                    if (!Users) {
                        return res.status(404).send({
                            success: false,
                            message: 'Something went wrong'
                        });
                    }
                    res.send({ success: true, data: Users });
                })
        } else {
            var newMainMenuSettings = new MainMenuSettings({
                user_id: req.body.user_id,
                background_image: req.body.background_image,
                menu_size: req.body.menu_size,
                section_size: req.body.section_size,
            });
            newMainMenuSettings.save(function(err, response) {
                if (err) throw err;
                res.json({ success: true, data: response });
            });
        }
    });
});
// used to get mainmenu settings
router.get('/get-mainmenu-settings/:user_id', (req, res, next) => {
    MainMenuSettings.find({
        user_id: req.params.user_id
    }, function(err, data) {
        if (err) throw err;
        res.send({ success: true, data: data });
    });
});


module.exports = router;