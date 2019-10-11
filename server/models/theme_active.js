const mongoose = require('mongoose');

const ThemeactiveSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    themeId:{type: mongoose.Schema.ObjectId, ref: 'theme_add'},
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Themeactive', ThemeactiveSchema);