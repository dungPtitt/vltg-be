// hồ sơ
const mongoose = require('mongoose');
const hosoSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        //id người người tải hồ sơ
        type: Number
    },
    name: {
        //id hồ sơ đã tải
        type: String
    },
    link: {
        // link xem hồ sơ
        type: String
    },
    cvId: {
        //id cv mẫu
        type: Number
    },
    createTime: {
        //thời gian tải hs
        type: Date
    },
    active: {
        type: String
    },
    linkHide: {
        type: String
    },
    scan: {
        type: Number
    },
    linkError: {
        //link sau khi ẩn chi tiết hồ sơ
        type: String
    },
    state: {
        type: Number
    }
}, {
    collection: 'hoso',
    versionKey: false
});

module.exports = mongoose.model("hoso", hosoSchema);