// sơ yếu lý lịch ứng viên
const mongoose = require('mongoose');
const ResumeUVSchema = new mongoose.Schema({
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
    collection: 'ResumeUV',
    versionKey: false
});

module.exports = mongoose.model('ResumeUV', ResumeUVSchema);