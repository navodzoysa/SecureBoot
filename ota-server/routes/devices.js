const express = require('express');
const router = express.Router();
const { getDevices, getDeviceById, provisionDevice, addDeviceInfo, updateDevice } = require('../controllers/deviceController');
const { authenticatedRoute } = require('../middleware/authHandler');

/* GET devices listing. */
router.get('/', authenticatedRoute, getDevices);
router.get('/device/:deviceId', authenticatedRoute, getDeviceById);
router.post('/provision', authenticatedRoute, provisionDevice);
router.post('/device-info', addDeviceInfo);
router.put('/update-device', updateDevice);

module.exports = router;