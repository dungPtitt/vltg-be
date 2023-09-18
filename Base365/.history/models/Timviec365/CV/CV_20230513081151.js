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
        Type: String
    },
    metaKey: {
        Type: String
    },
    metaDes: {
        Type: String
    },
    thuTu: {
        Type: Number
    },
    full: {
        Type: String
    },
    status: {
        Type: Number
    }

}, {
    collection: 'CV',
    versionKey: false
})

module.exports = mongoose.model("CV", CVSchema);