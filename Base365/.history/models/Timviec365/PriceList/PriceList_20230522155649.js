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
    intoMoney: String,
    hanDung: String,
    the: String,
    vat: String,
    quyenLoi: String,
    uuDai1: String,
    uuDai2: String,
    uuDai3: String,
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