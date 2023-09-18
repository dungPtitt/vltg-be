const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const cv = require('../../controllers/timviec/cv');

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
router.post('/findCV/', functions.checkToken, formData.parse(), cv.findCV);
router.post('/updateCV', formData.parse(), functions.checkToken, cv.updateCV);

// xóa mẫu cv
router.post('/deleteCV', functions.checkToken, formData.parse(), cv.deleteCV);

// thêm NganhCV
router.post('/createNganhCV', formData.parse(), functions.checkToken, cv.createNganhCV);

// sửa NganhCV- findNganhCV & updateNganhCV
router.post('/findNganhCV', functions.checkToken, formData.parse(), cv.findNganhCV);
router.post('/updateNganhCV', functions.checkToken, formData.parse(), cv.updateNganhCV);

// xóa NganhCV
router.post('/deleteNganhCV', functions.checkToken, formData.parse(), cv.deleteNganhCV);

// danh sách nhóm cv
router.post('/getCVGroup', functions.checkToken, formData.parse(), cv.getCVGroup);

module.exports = router;