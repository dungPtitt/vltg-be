const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ThuUVSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        //id người tạo thư
        type: Number
    },
    tId: {
        type: Number
    },
    lang: {
    // ngôn ngữ thư
        type: String
    },
    html: {
        //nội dung thư
        type: String
    },
    nameImg: {
        //tên ảnh
        type: String
    },
    status: {
        //trang thái
        type: Number
    }
}, {
    collection: 'ThuUV',
    versionKey: false
})

module.exports = mongoose.model("ThuUV", ThuUVSchema);
