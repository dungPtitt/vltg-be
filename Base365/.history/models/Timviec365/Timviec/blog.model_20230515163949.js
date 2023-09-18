const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    adminID: {
        type: Number,
        default: 0
    },
    langID: {
        type: Number,
        default: 1
    },
    title: String,
    titleRewrite: String,
    redirect301: {
        type: String,
        required: true,
    },
    canonical: {
        type: String,
        required: true,
    },
    mail: {
        type: Number,
        default: 0,
        required: true,
    },
    picture: {
        type: String,
        required: true,
    },
    teaser: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    thongTin: {
        type: String,
        required: true,
    },
    des: {
        type: String,
        required: true,
    },
    keyword: String,
    video: {
        type: String,
        required: true,
    },
    categoryID: {
        type: Number,
        required: true,
        default: 0
    },
    categoryCB: {
        type: Number,
        required: true,
    },
    date: Date,
    adminEdit: {
        type: Number,
        required: true,
        default: 0
    },
    dateLastEdit: {
        type: Date,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    hits: {
        type: Number,
        default: 0
    },
    active: {
        type: Number,
        default: 1
    },
    cateUrl: {
        type: String,
        required: true
    },
    hot: {
        type: Number,
        default: 0
    },
    new: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    urlLq: {
        type: String,
        required: true
    },
    tagCate: {
        type: Number,
        default: 0,
        required: true
    },
    Vl: {
        type: String,
        required: true
    },
    tdgy: {
        type: String,
    },
    ndgy: {
        type: String,
    },
    audio: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    collection: 'Blog',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Blog", blogSchema);