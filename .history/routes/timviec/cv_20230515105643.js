const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

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
router.post('/saveCV', formData.parse(), functions.checkToken, functions.uploadImg.single('nameImage'), cv.saveCV);

// xem mẫu cv viết sẵn
router.post('/viewAvailableCV/:cateId', formData.parse(), cv.viewAvailable);

// tính điểm cv
router.post('/countPoints', formData.parse(), cv.countPoints);




module.exports = router;