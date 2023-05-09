const { createHmac } = require('crypto');
const asyncHandler = require('express-async-handler');
const Device = require('../db/models/device');
const DeviceInfo = require('../db/models/deviceInfo');

const getDevices = asyncHandler(async (req, res) => {
	const data = await Device.find({ user: req.user.id });
	if (data && data.length > 0) {
		res.status(200).json(data);
	} else {
		res.status(404);
		throw new Error('Devices not found for current user.')
	}
})

const getDeviceById = asyncHandler(async (req, res) => {
	const data = await Device.findOne({ _id: req.params.deviceId, user: req.user.id });
	if (data) {
		res.status(200).json(data);
	} else {
		res.status(404);
		throw new Error('Device not found for current user.')
	}
})

const provisionDevice = asyncHandler(async (req, res) => {
	const { deviceName, deviceType } = req.body;
	if (!deviceName ||  !deviceType) { 
		res.status(400);
		throw new Error('Device name and device type is required')
	}
	const existingDevice = await Device.findOne({ deviceName: deviceName });
	if (existingDevice) { 
		res.status(400);
		throw new Error('Device already exists with the given name. Please choose a different name');
	}
	const device = new Device({
		deviceName: deviceName,
		deviceType: deviceType,
		user: req.user.id,
	})
	const generatedPreSharedKey = createHmac('sha256', process.env.PRE_SHARED_SECRET).update(device.id).digest('hex');
	device.preSharedKey = generatedPreSharedKey;
	const savedDevice = await device.save();

	if (savedDevice) {
		res.status(201).json({
			deviceName: savedDevice.deviceName,
			user: savedDevice.user,
			preSharedKey: savedDevice.preSharedKey,
			message: 'Your ' + savedDevice.deviceName + ' is ready to be provisioned. Please flash the device',
		});
	} else {
		res.status(404);
		throw new Error('Could not add device for current user.')
	}
})

const addDeviceInfo = asyncHandler(async (req, res) => {
	const deviceInfo = new DeviceInfo({
		deviceId: req.body.deviceId,
		deviceName: req.body.deviceName,
		deviceStatus: req.body.deviceStatus,
		deviceFirmwareVersion: req.body.deviceFirmwareVersion,
	})
	const savedDeviceInfo = await deviceInfo.save();

	if (savedDeviceInfo) {
		res.status(201).json({
			deviceId: savedDeviceInfo.deviceId,
			deviceName: savedDeviceInfo.deviceName,
			deviceStatus: savedDeviceInfo.deviceStatus,
			deviceFirmwareVersion: savedDeviceInfo.deviceFirmwareVersion,
			user: savedDeviceInfo.user,
		});
	} else {
		res.status(404);
		throw new Error('Could not add device info for current user.')
	}
})

const updateDevice = asyncHandler(async (req, res) => {
	const { preSharedKey } = req.body;
	res.status(200).json(preSharedKey);
})

module.exports = { getDevices, getDeviceById, provisionDevice, addDeviceInfo, updateDevice };