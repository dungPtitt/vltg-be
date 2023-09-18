const express = require('express');
const router = express.Router();
const priceList = require('../../controllers/timviec/priceList');

// danh mục bảng giá
router.post('/getPriceList', priceList.getPriceList);

// chi tiết gói dich vụ
router.post('/viewDetail/:_id', priceList.viewDetail);
module.exports = router;