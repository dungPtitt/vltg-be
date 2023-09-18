const mongoose = require('mongoose');
const Schema = mongoose.Schema
const likeSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        //id người like
        type: Number
    },
    idMau: {
        //id của mẫu 
        type: Number
    },
    Status: {
        // trạng thái
        type: Number
    },
    type: {
        // 0:thư,1:cv,2:sơ yếu,3:đơn
        type: Number
    },
}, {
    collection: 'like',
    versionKey: false
});

module.exports = mongoose.model("like", likeSchema);