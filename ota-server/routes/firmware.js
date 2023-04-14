const express = require('express');
const router = express.Router();
const Firmware = require('../db/models/firmware');
const { getFirmwares, uploadFirmware, downloadFirmware } = require('../controllers/firmwareController');
const { authenticatedRoute } = require('../middleware/authHandler');

/* GET firmware listing. */
router.get('/', authenticatedRoute, getFirmwares);
router.post('/upload', authenticatedRoute, uploadFirmware);
router.get('/download', authenticatedRoute, downloadFirmware);

module.exports = router;