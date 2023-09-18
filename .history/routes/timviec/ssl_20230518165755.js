const express = require('express');
const router = express.Router();
const ssl = require('../../controllers/timviec/ssl');

// so sánh lương
// so sánh theo từ khóa
router.post('', ssl.findByKeyword);

//so sánh theo ngành
router.post('/findByCategory', ssl.findByCategory);

module.exports = router;