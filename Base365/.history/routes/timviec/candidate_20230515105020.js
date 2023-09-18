const express = require('express');

const candidate = require('../../controllers/timviec/candidate');
const formData = require('express-form-data');
const router = express.Router();
const { uploadFile } = require('../../services/functions.js');
const functions = require('../../services/functions');

router.get('/', candidate.index);
router.post('/RegisterB1', formData.parse(), candidate.RegisterB1);
router.post('/RegisterB2VideoUpload', uploadFile.single('videoUpload'), candidate.RegisterB2VideoUpload);
router.post('/RegisterB2CvSite', uploadFile.single('imageUpload'), candidate.RegisterB2CvSite);

router.post('/loginUv', formData.parse(), candidate.loginUv);
router.post('/login', formData.parse(), candidate.login);
router.post('/AddUserChat365', formData.parse(), candidate.AddUserChat365);
router.post('/completeProfileQlc', formData.parse(), functions.checkToken, candidate.completeProfileQlc);
router.post('/cvXinViec', formData.parse(), functions.checkToken, candidate.cvXinViec);
router.post('/RegisterB2CvUpload', uploadFile.any(), candidate.RegisterB2CvUpload);


// đổi mật khẩu
router.post('/sendOTP', formData.parse(), candidate.sendOTP);
router.post('/confirmOTP', formData.parse(), functions.checkToken, candidate.confirmOTP); // kiểm tra token( có + còn thời gian) -> xác nhận otp
router.post('/changePassword', formData.parse(), functions.checkToken, candidate.changePassword); // kiểm tra token( có + còn thời gian) -> đổi mật khẩu

module.exports = router;