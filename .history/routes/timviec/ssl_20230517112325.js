const express = require('express');
const router = express.Router();
const sll = require('../../controllers/timviec/ssl');

// so sánh lương
router.post('', ssl.findByCondition);

module.exports = router;