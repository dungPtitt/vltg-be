const mongoose = require('mongoose');
const DanhMucMail365Schema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String
    },
    alias: {
        type: String
    },

    cateId: {
        type: Number
    },
    sapo: {
        type: String
    },
    content: {
        type: String
    },
    menu: {
        type: Number
    },
    sort: {
        type: Number
    },
    status: {
        type: Number
    }

}, {
    collection: 'DanhMucMail365',
    versionKey: false
});

module.exports = mongoose.model("DanhMucMail365", DanhMucMail365Schema)