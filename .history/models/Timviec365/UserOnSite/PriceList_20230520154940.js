const mongoose = require('mongoose');
const PriceListSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tuan: String,
    chietKhau: String,
    thanhTien: String,
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
    collection: 'userUnset',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('PriceList', PriceListSchema);