const mongoose = require('mongoose');
const DonUVSchema = new mongoose.Schema({
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
    collection: 'DonUV',
    versionKey: false
});

module.exports = mongoose.model("DonUV", DonUVSchema);