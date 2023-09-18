const express = require('express');
const router = express.Router();
const priceList = require('../../controllers/timviec/priceList');

// thông tin bảng giá
router.post('/getPriceList', priceList.getPriceList);

// chi tiết gói dich vụ
router.post('/viewDetail', priceList.viewDetail);
module.exports = router;