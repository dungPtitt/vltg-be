var express = require('express');
var router = express.Router();
var toolVLTG = require('./vieclamtheogio/tool');
var manageAccountCandidate = require('./vieclamtheogio/manageAccountCandidate');
var manageAccountCompany = require('./vieclamtheogio/manageAccountCompany');
var viecLam = require('./vieclamtheogio/viecLam');
var admin = require('./vieclamtheogio/admin');

router.use('/tool', toolVLTG);
router.use('/manageAccountCandidate', manageAccountCandidate);
router.use('/manageAccountCompany', manageAccountCompany);
router.use('/viecLam', viecLam);
router.use('/admin', admin);

module.exports = router