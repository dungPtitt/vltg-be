const mongoose = require('mongoose');
const Schema = mongoose.Schema
const DonUVSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        //id người tạo đơn
        type: Number
    },
    donId: {

        type: Number
    },
    Status: {
        // trạng thái
        type: Number
    },
    lang: {
        //ngôn ngữ tạo đơn
        type: Number
    },
    html: {
        // nội dung đơn
        type: Number
    },
    nameImg: {
        // tên ảnh
        type: Number
    },
}, {
    collection: 'DonUV',
    versionKey: false
});

module.exports = mongoose.model("DonUV", DonUVSchema);