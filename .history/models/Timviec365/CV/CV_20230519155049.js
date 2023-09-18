const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CVSchema = new mongoose.Schema({
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
    urlAlias: {
        type: String,
    },
    urlCanonical: {
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
    cvIndex: {
        type: Number,
    },
    cId: {
        type: Number
    },
    content: {
        type: String
    },
    motaCv: {
        type: String
    },
    htmlVi: {
        type: String
    },
    htmlEn: {
        type: String
    },
    htmlJp: {
        type: Object
    },
    htmlCn: {
        type: Object
    },
    htmlKr: {
        type: String
    },
    cateId: {
        type: Number
    },
    langId: {
        type: Number
    },
    designId: {
        type: Number
    },
    exp: {
        type: Number
    },
    nhuCau: {
        type: Number
    },
    metaTitle: {
        type: String
    },
    metaKey: {
        type: String
    },
    metaDes: {
        type: String
    },
    thuTu: {
        type: Number
    },
    full: {
        type: String
    },
    status: {
        type: Number
    },
    cvPoint: {
        type: Number
    },

}, {
    collection: 'CV',
    versionKey: false
});
module.exports = mongoose.model("CV", CVSchema);