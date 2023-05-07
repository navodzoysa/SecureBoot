const asyncHandler = require('express-async-handler');
const Firmware = require('../db/models/firmware');
const path = require('path');

const getFirmwares = asyncHandler(async (req, res) => {
    const data = await Firmware.find({ user: req.user.id });
	if (data && data.length > 0) {
		res.status(200).json(data);
	} else {
		res.status(404);
		throw new Error('Firmwares not found for current user.');
	}
})

const getFirmwareById = asyncHandler(async (req, res) => {
    const data = await Firmware.findOne({ _id: req.params.firmwareId, user: req.user.id });
	if (data) {
		res.status(200).json(data);
	} else {
		res.status(404);
		throw new Error('Firmware not found for current user.');
	}
})

const uploadFirmware = asyncHandler(async (req, res) => {
	const { file } = req;
	const { firmwareName, deviceType, firmwareVersion } = req.body;
	if (!firmwareName || !deviceType || !firmwareVersion) {
		res.status(400);
		throw new Error('Firmware name, device type or firmware version is missing');
	}
	const existingFirmware = await Firmware.findOne({
		firmwareSupportedDevice: deviceType.toLowerCase(),
		firmwareVersion: firmwareVersion
	});
	if (existingFirmware) {
		res.status(400);
		throw new Error('Firmware already exists with that version. Please upload a new version');
	}
	try {
		if (file) {
			const alternateVersion = firmwareVersion.split('.').join('');
			const newFirmware = new Firmware({
				firmwareName: firmwareName,
				firmwareSupportedDevice: deviceType.toLowerCase(),
				firmwareVersion: firmwareVersion,
				firmwareAltVersion: alternateVersion,
				firmwareBinaryPath: file.path,
				firmwareBinaryPathName: file.filename,
				firmwareMimeType: file.mimetype,
				firmwaredestination: file.destination,
				firmwareSize: file.size,
				user: req.user.id,
			});
			const savedFirmware = await newFirmware.save();
			if (savedFirmware) {
				res.status(201);
				res.json({
					firmwareId: savedFirmware.id,
					firmwareName: savedFirmware.firmwareName,
					firmwareSupportedDevice: savedFirmware.firmwareSupportedDevice,
					firmwareVersion: savedFirmware.firmwareVersion,
					firmwareSize: savedFirmware.firmwareSize,
					message: 'Firmware uploaded successfully',
				});
			} else {
				res.status(500);
				throw new Error('Failed to save firmware. Please try again!');
			}
		} else {
			res.status(404);
			throw new Error('File not found.');
		}
	} catch (err) {
		res.status(400);
		throw new Error('Error occured while uploading firmware.');
	}
})

const downloadFirmware = asyncHandler(async (req, res) => {
	const data = await Firmware.findOne({ _id: req.params.firmwareId });

	if (data) {
		res.status(200);
		res.set({ 'Content-Type': data.firmwareMimeType, 'Content-Disposition': 'attachment; file=' + data.firmwareName });
		res.sendFile(path.join(__dirname, '../' + data.firmwaredestination, data.firmwareBinaryPathName))
	} else {
		res.status(404);
		throw new Error('Firmware not found.')
	}
})

const getLatestFirmware = asyncHandler(async (req, res) => {
	const { deviceType } = req.params;
	const { currentVersion } = req.query;

	if (!deviceType || !currentVersion) {
		res.status(400);
		throw new Error('Device tpye and current firmware version is missing.');
	}

	try {
		let currentAlternateVersion = currentVersion.split('.').join('');
		const latestFirmware = await Firmware.findOne({
			firmwareSupportedDevice: deviceType.toLowerCase()
		}).sort({ firmwareAltVersion: -1 }).limit(1);
		if (latestFirmware) {
			if (latestFirmware.firmwareAltVersion > parseInt(currentAlternateVersion)) {
				res.status(200).json(latestFirmware);
			} else {
				res.status(400);
				throw new Error('Current firmware version is equal to the latest version.');
			}
		} else {
			res.status(404);
			throw new Error('No firmware found for the given device type.');
		}
	} catch (err) {
		res.status(400);
		throw new Error(err.message);
	}
})


module.exports = { getFirmwares, getFirmwareById, uploadFirmware, downloadFirmware, getLatestFirmware };