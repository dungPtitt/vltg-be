const express = require('express');
const router = express.Router();
const ssl = require('../../controllers/timviec/ssl');

// so sánh lương
router.post('', ssl.findByCondition);

module.exports = router;