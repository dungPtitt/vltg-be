const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const cv = require('../../controllers/timviec/cv');


// CV & hồ sơ
router.post('/insertDataCV', formData.parse(), cv.insertDataCV);

// tìm tất cả mẫu CV
router.post('/getListCV', formData.parse(), cv.getListCV);

// danh sách ngành cv
router.post('/getNganhCV', formData.parse(), cv.getNganhCV);

// tìm theo điều kiện
router.post('/getListCVByCondition', formData.parse(), cv.getListCVByCondition);

// xem trước cv
router.post('/previewCV', formData.parse(), cv.previewCV);

// chi tiết cv 
router.post('/detailCV', formData.parse(), cv.detailCV);

// lưu và tải cv
router.post('/saveCV', functions.checkToken, formData.parse(), functions.decrypt, cv.saveCV);

// xem mẫu cv viết sẵn
router.post('/viewAvailableCV', formData.parse(), cv.viewAvailable);

// tính điểm cv
router.post('/countPoints', formData.parse(), cv.countPoints);

// tạo mới mẫu cv
router.post('/createCV', formData.parse(), functions.checkToken, cv.createCV);

// sửa mẫu cv - findCV & updateCV
router.post('/findCV/', formData.parse(), functions.checkToken, cv.findCV);
router.post('/updateCV', formData.parse(), functions.checkToken, cv.updateCV);

// xóa mẫu cv
router.post('/deleteCV', formData.parse(), functions.checkToken, cv.deleteCV);

// thêm NganhCV
router.post('/createNganhCV', formData.parse(), functions.checkToken, cv.createNganhCV);

// sửa NganhCV- findNganhCV & updateNganhCV
router.post('/findNganhCV', formData.parse(), functions.checkToken, cv.findNganhCV);
router.post('/updateNganhCV', formData.parse(), functions.checkToken, formData.parse(), cv.updateNganhCV);

// xóa NganhCV
router.post('/deleteNganhCV', formData.parse(), functions.checkToken, formData.parse(), cv.deleteNganhCV);





module.exports = router;