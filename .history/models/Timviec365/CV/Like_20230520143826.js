const mongoose = require('mongoose');
const LikeSchema = new mongoose.Schema({
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
    collection: 'Like',
    versionKey: false
});

module.exports = mongoose.model("Like", LikeSchema);