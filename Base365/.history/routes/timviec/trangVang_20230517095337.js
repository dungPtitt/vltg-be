const express = require('express');
const router = express.Router();
const tv = require('../../controllers/timviec/trangVang');

// danh mục lĩnh vực ngành nghề
router.post('/getLV', tv.getLV);

module.exports = router;