const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const thu = require('../../controllers/timviec/thu');

//lấy danh sách các mẫu thư
router.post('/getThu', formData.parse(), thu.getThu);

// tìm thư danh sách theo ngành 
router.post('/getByNganh', formData.parse(), thu.getByNganh);

//danh sách ngành thư
router.post('/getNganhThu', formData.parse(), thu.getNganhThu);

// xem trước thư
router.post('/previewThu', formData.parse(), thu.previewThu);

//xem chi tiết thư
router.post('/detailThu', formData.parse(), functions.checkToken, thu.detailThu);

//lưu thư
router.post('/saveThu', formData.parse(), functions.decrypt, functions.checkToken, thu.saveThu);

// thêm mới NganhThu
router.post('/createNganhThu', formData.parse(), functions.checkToken, thu.createNganhThu);

// sửa NganhThu- findNganhThu & updateNganhThu
router.post('/findNganhThu', functions.checkToken, formData.parse(), thu.findNganhThu);
router.post('/updateNganhThu', functions.checkToken, formData.parse(), thu.updateNganhThu);

// xóa NganThu
router.post('/deleteNganhThu', functions.checkToken, formData.parse(), thu.deleteNganhThu);

// tạo mới mẫu Thu
router.post('/createThu', formData.parse(), functions.checkToken, thu.createThu);

// sửa mẫu Thu - findThu & updateThu
router.post('/findThu', functions.checkToken, formData.parse(), thu.findThu);
router.post('/updateThu', formData.parse(), functions.checkToken, thu.updateThu);

// xóa mẫu Thu
router.post('/deleteThu', functions.checkToken, formData.parse(), thu.deleteThu);

module.exports = router;