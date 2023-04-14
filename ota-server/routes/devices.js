const express = require('express');
const router = express.Router();
const { getDevices, getDeviceById, addDeviceInfo } = require('../controllers/deviceController');
const { authenticatedRoute } = require('../middleware/authHandler');

/* GET devices listing. */
router.get('/', authenticatedRoute, getDevices);
router.get('/device/:deviceId', authenticatedRoute, getDeviceById);
router.post('/device-info', authenticatedRoute, addDeviceInfo);

module.exports = router;