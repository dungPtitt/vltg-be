const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const syll = require('../../controllers/timviec/syll');

//lấy danh sách các mẫu syll
router.post('/getSYLL', formData.parse(), syll.getSYLL);

// xem trước syll
router.post('/previewSYLL', formData.parse(), syll.previewSYLL);

//xem chi tiết syll
router.post('/detailSYLL', formData.parse(), functions.checkToken, syll.detailSYLL);

//lưu syll
router.post('/saveThu', formData.parse(), functions.decrypt, functions.checkToken, syll.saveSYLL);

// tạo mới mẫu SYLL
router.post('/createSYLL', formData.parse(), functions.checkToken, syll.createSYLL);

// sửa mẫu SYLL - findSYLL & updateSYLL
router.post('/findSYLL', functions.checkToken, syll.findSYLL);
router.post('/updateSYLL', formData.parse(), functions.checkToken, syll.updateSYLL);

// xóa mẫu SYLL
router.post('/deleteSYLL', functions.checkToken, syll.deleteSYLL);

module.exports = router;