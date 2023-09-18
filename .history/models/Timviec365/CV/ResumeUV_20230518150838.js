const mongoose = require('mongoose');
const Schema = mongoose.Schema
const HoSoUVSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    userId: {
        type: Number
    },
    hoSoId: {
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
    collection: 'HoSoUV',
    versionKey: false
});

module.exports = mongoose.model('HoSoUV', HoSoUVSchema);
