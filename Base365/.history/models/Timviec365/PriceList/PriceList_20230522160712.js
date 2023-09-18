//bảng giá
const mongoose = require('mongoose');
const PriceListSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    // tuần
    week: String,
    //chiết khấu
    discount: String,
    // thành tiền
    totalAmount: String,
    // hạn dùng
    expiryDate: String,
    the: String,
    vat: String,
    // quyền lợi
    benefits: String,
    //ưu đãi
    incentive1: String,
    incentive2: String,
    incentive3: String,
    cm1: String,
    cm2: String,
    cm3: String,
    cmLogo: String,
    show: Number,
    tk: String,
    do: Number,
    hp: Number,
    type: String,
    qlHD: String,
    udHD: String,
    crm: Number,
}, {
    collection: 'PriceList',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('PriceList', PriceListSchema);