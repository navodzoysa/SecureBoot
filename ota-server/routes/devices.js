const express = require('express');
const router = express.Router();
const databaseConnection = require('../db/conn');
const Device = require('../db/models/device');

/* GET devices listing. */
router.get('/', async (req, res) => {
	try {
		const data = await Device.find();
		res.json(data);
	} catch (error) { 
		res.status(500).json({message: error.message})
	}
});

router.get('/device/:deviceId', async (req, res) => { 
	try {
		const data = await Device.findOne({ deviceId: req.params.deviceId });
		res.json(data);
	} catch (error) { 
		res.status(500).json({message: error.message})
	}
})

router.post('/device-info', (req, res) => {
	const device = new Device({
		deviceId: req.body.deviceId,
		deviceName: req.body.deviceName,
		deviceStatus: req.body.deviceStatus,
		deviceFirmwareVersion: req.body.deviceFirmwareVersion,
	})
	device.save();
	res.json(device);
})

module.exports = router;