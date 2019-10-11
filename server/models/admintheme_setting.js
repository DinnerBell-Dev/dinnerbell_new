const mongoose = require('mongoose');

const AdminthemesettingSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    name: {
        type: String,
        required: true,
    },
    themeId: { type: mongoose.Schema.ObjectId, ref: 'Theme_add' },
    baseSetting: mongoose.Schema.Types.Mixed,
    mainMenu: mongoose.Schema.Types.Mixed,
    orderSetting: mongoose.Schema.Types.Mixed,
    feedbackSetting: mongoose.Schema.Types.Mixed,
    itemDetailSetting: mongoose.Schema.Types.Mixed,
    menuItemSetting: mongoose.Schema.Types.Mixed,
    introSetting: mongoose.Schema.Types.Mixed
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Adminthemesetting', AdminthemesettingSchema);