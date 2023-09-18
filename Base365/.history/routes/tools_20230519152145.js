var express = require('express');
var router = express.Router();
var toolUser = require('../controllers/tools/user');
var toolTimviec365 = require('../controllers/tools/timviec365')
var formData = require('express-form-data');
const functions = require('../services/functions');

// API quét data người dùng từ base chat
router.post('/addUserChat365', toolUser.addUserChat365);
router.post('/addUserCompanyTimviec365', toolUser.addUserCompanyTimviec365);
router.post('/addUserCandidateTimviec365', toolUser.addUserCandidateTimviec365);
router.post('/deleteUser', toolUser.deleteUser);

// api quét data keywork
router.post('/addKeyword', toolTimviec365.toolKeyword);

// api quét data admin user
router.post('/toolAddAdminUSer', toolTimviec365.toolAddAdminUSer);

// api quét data lĩnh vực
router.post('/toolLV', toolTimviec365.toolLV);

// api quét data newTV365
router.post('/toolNewTV365', toolTimviec365.toolNewTV365);

// api quét data mẫu cv
router.post('/toolCV', toolTimviec365.toolCV);

// api quét data category blog
router.post('/toolCategoryBlog', toolTimviec365.toolCategoryBlog);

module.exports = router;