const express = require('express');
const router = express.router;
const priceList = require('../../controllers/timviec/priceList');
// thông tin bảng giá
router.post('/getPriceList', priceList.getPriceList);

module.exports = router;