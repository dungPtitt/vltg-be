// sơ yếu lý lịch
const mongoose = require('mongoose');
const ResumeSchema = new mongoose.Schema({
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
    htmlEn: {
        type: String
    },
    htmlJp: {
        type: String
    },
    htmlCn: {
        type: String
    },
    htmlKr: {
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
    collection: 'Resume',
    versionKey: false
});

module.exports = mongoose.model('Resume', ResumeSchema);