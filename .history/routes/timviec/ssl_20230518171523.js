const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const ssl = require('../../controllers/timviec/ssl');

// so sánh lương
// so sánh theo từ khóa
router.post('/findByCategory', ssl.findByCategory);

//so sánh theo ngành
router.post('/findByKeyword', formData.parse(), ssl.findByKeyword);

module.exports = router;