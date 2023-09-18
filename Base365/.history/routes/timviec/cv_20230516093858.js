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
router.post('/saveCV', functions.checkToken, functions.uploadImgKhoAnh.single('base64Encoded'), (req, res, next) => {
    const base64Image = req.body.base64Encoded;
    console.log(base64Image);
    const imageBuffer = JSON.parse(Buffer.from(base64Image, 'base64').toString());
    req.file = imageBuffer;
    multer.diskStorage({
        destination: function(req, file, cb) {
            const userId = req.user.data._id; // Lấy id người dùng từ request
            const userDestination = `${public/KhoAnh}/${userId}`; // Tạo đường dẫn đến thư mục của người dùng
            if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                fs.mkdirSync(userDestination, { recursive: true });
            }
            cb(null, userDestination);
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, imageBuffer.fieldname + uniqueSuffix + '.' + imageBuffer.originalname.split('.').pop())
        }
    })
    return next();
}, cv.saveCV);

// xem mẫu cv viết sẵn
router.post('/viewAvailableCV/:cateId', formData.parse(), cv.viewAvailable);

// tính điểm cv
router.post('/countPoints', formData.parse(), cv.countPoints);




module.exports = router;