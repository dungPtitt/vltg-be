const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const blog = require('../../controllers/khamPha/blog');

// danh sách blog gần đây
router.post('/getBlogRecent', blog.getBlogRecent);

module.exports = router;