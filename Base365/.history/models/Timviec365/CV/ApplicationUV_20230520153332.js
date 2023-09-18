const mongoose = require('mongoose'); //đơn xin việc ứng viên
const ApplicationUVSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    userId: {
        //id người tạo đơn
        type: Number
    },
    donId: {

        type: Number
    },
    status: {
        // trạng thái
        type: Number
    },
    lang: {
        //ngôn ngữ tạo đơn
        type: Number
    },
    html: {
        type: String
    },
    nameImg: {
        type: String
    },
}, {
    collection: 'ApplicationUV',
    versionKey: false
});

module.exports = mongoose.model("ApplicationUV", ApplicationUVSchema);