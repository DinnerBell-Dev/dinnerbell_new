const mongoose = require('mongoose');

const ThemeaddSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
    name: {
        type: String,
        unique:true,
        required: true
    },
    photo_url: {
        type: String,
    }
},
    {
        timestamps: true,
    },

);

module.exports = mongoose.model('Themeadd', ThemeaddSchema);