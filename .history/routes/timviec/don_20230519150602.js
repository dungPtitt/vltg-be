const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const don = require('../../controllers/timviec/don');

// lấy danh sách các mẫu đơn
router.post('/getDon', formData.parse(), don.getDon);

// tìm đơn danh sách theo ngành 
router.post('/getByNganh', formData.parse(), don.getByNganh);

// danh sách ngành đơn
router.post('/getNganhDon', formData.parse(), don.getNganhDon);

// xem trước đơn xin việc
router.post('/previewDon', formData.parse(), don.previewDon);

// xem chi tiết đơn
router.post('/detailDon', formData.parse(), functions.checkToken, don.detailDon);

// lưu và tải DON
router.post('/saveDon', formData.parse(), functions.checkToken, functions.decrypt, don.saveDon);

// thêm mới NganhDon
router.post('/createNganhDon', formData.parse(), functions.checkToken, don.createNganhDon);

// sửa NganhDon- findNganhDon & updateNganhDon
router.post('/findNganhDon', functions.checkToken, formData.parse(), don.findNganhDon);
router.post('/updateNganhDon', functions.checkToken, formData.parse(), don.updateNganhDon);

// xóa NganhDon
// router.post('/deleteNganhDon', functions.checkToken, formData.parse(), don.deleteNganhDon);

// tạo mới mẫu Don
router.post('/createDon', formData.parse(), functions.checkToken, don.createDon);

// sửa mẫu Don - findDon & updateDon
router.post('/findDon', functions.checkToken, formData.parse(), don.findDon);
router.post('/updateDon', formData.parse(), functions.checkToken, don.updateDon);

// xóa mẫu Don
router.post('/deleteDon', functions.checkToken, formData.parse(), don.deleteDon);


module.exports = router;