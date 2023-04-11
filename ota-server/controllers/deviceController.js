const asyncHandler = require('express-async-handler');
const Device = require('../db/models/device');

const getDevices = asyncHandler(async (req, res) => {
	const data = await Device.find({ user: req.user.id });
	if (data && data.length > 0) {
		res.json(data);
	} else {
		res.status(500);
		throw new Error('Devices not found for current user.')
	}
})

const getDeviceById = asyncHandler(async (req, res) => {
	const data = await Device.findOne({ deviceId: req.params.deviceId, user: req.user.id });
	if (data) {
		res.json(data);
	} else {
		res.status(500);
		throw new Error('Devices not found for current user.')
	}
})

const addDeviceInfo = asyncHandler(async (req, res) => {
	const device = new Device({
		deviceId: req.body.deviceId,
		deviceName: req.body.deviceName,
		deviceStatus: req.body.deviceStatus,
		deviceFirmwareVersion: req.body.deviceFirmwareVersion,
		user: req.user.id,
	})
	const savedDevice = await device.save();

	if (savedDevice) {
		res.status(201).json({
			deviceId: savedDevice.deviceId,
			deviceName: savedDevice.deviceName,
			deviceStatus: savedDevice.deviceStatus,
			deviceFirmwareVersion: savedDevice.deviceFirmwareVersion,
			user: savedDevice.user,
		});
	} else {
		res.status(500);
		throw new Error('Could not add device info for current user.')
	}
})

module.exports = { getDevices, getDeviceById, addDeviceInfo };