const express = require('express');
const router = express.Router();
const mail365 = require('../../controllers/timviec/mail365');

// ds danh mục email trang chủ
router.post('', mail365.getAll);

// ds email theo mẫu
router.post('/findBySample', mail365.findBySample);

// ds email theo danh mục
router.post('/findByCategory', mail365.findBy);

// xem trước email
router.post('/preview', mail365.preview);

// chi tiết email
router.post('/viewDetail', mail365.viewDetail);

module.exports = router;