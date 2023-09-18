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

module.exports = router;