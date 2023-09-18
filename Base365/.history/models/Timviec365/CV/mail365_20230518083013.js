const mongoose = require('mongoose');
const Mail365Schema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String
    },
    alias: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    view: {
        type: Number
    },
    favourite: {
        type: Number
    },
    downLoad: {
        type: Number
    },
    htmlVi: {
        type: String
    },
    color: {
        type: String
    },
    cateId: {
        type: Number
    },
    status: {
        type: Number
    },
    vip: {
        type: Number
    },
    langId: {
        type: Number
    },
}, {
    collection: 'HoSo',
    versionKey: false
});

module.exports = mongoose.model('Mail365', Mail365Schema);