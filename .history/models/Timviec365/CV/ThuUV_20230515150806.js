const mongoose = require('mongoose');
const ThuUVSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        type: Number
    },
    tId: {
        type: Number
    },
    lang: {
        type: String
    },
    html: {
        type: String
    },
    nameImg: {
        type: String
    },
    status: {
        type: Number
    }
}, {
    collection: 'ThuUV',
    versionKey: false
})

module.exports = mongoose.model("ThuUV", ThuUVSchema);