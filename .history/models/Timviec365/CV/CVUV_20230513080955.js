const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CVUVSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        //id người tạo cv
        type: Number
    },
    cvId: {
        //id của mẫu cv
        type: Number
    },
    lang: {
        // ngôn ngữ tạo cv
        type: String
    },
    html: {
        // nội dung cv
        type: String
    },
    nameImage: {
        //tên ảnh đại diện
        type: String
    },
    timeEdit: {
        //thời gian chỉnh sửa cv
        type: Date
    },
    status: {
        //trạng thái cv
        type: Number
    },
    deleteCv: {
        //cv đã xóa hay ch
        type: Number,
        default: 0
    },
    heightCv: {
        type: Number,
        default: 0
    },
    scan: {
        type: Number
    },
    state: {
        type: Number
    }
}, {
    collection: 'CVUV',
    versionKey: false
});

module.exports = mongoose.model("CVUV", CVUVSchema);