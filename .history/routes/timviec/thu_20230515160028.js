const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const thu = require('../../controllers/timviec/thu');

//lấy danh sách các mẫu thư
router.post('/getThu', formData.parse(), thu.getThu);

// tìm thư danh sách theo ngành 
router.post('/getByNganh/:cateId', formData.parse(), thu.getByNganh);

//danh sách ngành thư
router.post('/getNganhThu', formData.parse(), thu.getNganhThu);

// xem trước thư
router.post('/previewThu/:_id', formData.parse(), thu.previewThu);

//xem chi tiết thư
router.post('/detailThu/:_id', formData.parse(), functions.checkToken, thu.detailThu);

//lưu thư
router.post('/saveThu/:_id', formData.parse(), functions.checkToken, thu.saveThu);

module.exports = router;