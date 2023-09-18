const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const syll = require('../../controllers/timviec/syll');

//lấy danh sách các mẫu đơn
router.post('/getDon', formData.parse(), don.getDon);

// tìm đơn danh sách theo ngành 
router.post('/getByNganh/:cateId', formData.parse(), don.getByNganh);

//danh sách ngành đơn
router.post('/getNganhDon', formData.parse(), don.getNganhDon);

// xem trước đơn xin việc
router.post('/previewDon/:_id', formData.parse(), don.previewDon);

//xem chi tiết đơn
router.post('/detailDon/:_id', formData.parse(), functions.checkToken, don.detailDon);

module.exports = router;