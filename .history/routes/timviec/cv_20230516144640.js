const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');
const multer = require('multer')

const cv = require('../../controllers/timviec/cv');


// CV & hồ sơ
router.post('/insertDataCV', formData.parse(), cv.insertDataCV);

// tìm tất cả mẫu CV
router.post('/getListCV', formData.parse(), cv.getListCV);

//danh sách ngành cv
router.post('/getNganhCV', formData.parse(), cv.getNganhCV);

//tìm theo điều kiện
router.post('/getListCVByCondition', formData.parse(), cv.getListCVByCondition);

//xem trước cv
router.post('/previewCV/:_id', formData.parse(), cv.previewCV);

//chi tiết cv 
router.post('/detailCV', formData.parse(), cv.detailCV);

//lưu và tải cv
router.post('/saveCV', functions.checkToken, formData.parse(), functions.decrypt, cv.saveCV);

// xem mẫu cv viết sẵn
router.post('/viewAvailableCV/:cateId', formData.parse(), cv.viewAvailable);

// tính điểm cv
router.post('/countPoints', formData.parse(), cv.countPoints);

// tạo mới cv
router.post('/createCV', formData.parse(), functions.checkToken, cv.createCV);

// sửa cv
// b1. lấy dữ liệu cũ
router.post = ('/findCV/:_id', functions.checkToken, cv.findCV);
//b2. cập nhật
router.post = ('/updateCV/:_id', formData.parse(), functions.checkToken, cv.updateCV);

//xóa cv
router.post = ('/deleteCV/:_id', functions.checkToken, cv.deleteCV);


module.exports = router;