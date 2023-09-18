const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const syll = require('../../controllers/timviec/syll');

//lấy danh sách các mẫu syll
router.post('/getSYLL', formData.parse(), syll.getSYLL);

// xem trước syll
router.post('/previewSYLL/:_id', formData.parse(), syll.previewSYLL);

//xem chi tiết syll
router.post('/detailSYLL/:_id', formData.parse(), functions.checkToken, syll.detailSYLL);

//lưu syll
router.post('/saveThu/:_id', formData.parse(), functions.decrypt, functions.checkToken, syll.saveSYLL);

// tạo mới mẫu SYLL
router.post('/createSYLL', formData.parse(), functions.checkToken, cv.createSYLL);

// sửa mẫu SYLL - findSYLL & updateSYLL
router.post('/findSYLL/:_id', functions.checkToken, cv.findSYLL);
router.post('/updateSYLL/:_id', formData.parse(), functions.checkToken, cv.updateSYLL);

// xóa mẫu SYLL
router.post('/deleteSYLL/:_id', functions.checkToken, cv.deleteSYLL);

module.exports = router;