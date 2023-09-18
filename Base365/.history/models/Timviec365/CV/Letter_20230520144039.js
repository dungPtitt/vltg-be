const mongoose = require('mongoose');
const LetterSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
    },
    alias: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    color: {
        type: String
    },
    view: {
        type: Number
    },
    favorite: {
        type: Number
    },
    download: {
        type: Number
    },
    vip: {
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
    cateId: {
        type: Number
    },
    exp: {
        type: Number
    },
    nhuCau: {
        type: Number
    },
    status: {
        Type: Number
    },
    langId: {
        type: Number
    },

}, {
    collection: 'Letter',
    versionKey: false
})

module.exports = mongoose.model('Letter', LetterSchema);