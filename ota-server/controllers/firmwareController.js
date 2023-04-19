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
	try {
		if (file) {
			const newFirmware = new Firmware({
				firmwareName: file.originalname,
				firmwareSupportedDevice: 'ESP32',
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
					firmwareName: savedFirmware.firmwareName,
					firmwareSupportedDevice: 'ESP32',
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
		console.log(err);
		res.status(400);
		throw new Error('err');
	}
})

const downloadFirmware = asyncHandler(async (req, res) => {
	const data = await Firmware.findOne({ _id: req.params.firmwareId, user: req.user.id });

	if (data) {
		res.status(200);
		res.set({ 'Content-Type': data.firmwareMimeType, 'Content-Disposition': 'attachment; file=' + data.firmwareName });
		res.sendFile(path.join(__dirname, '../' + data.firmwaredestination, data.firmwareBinaryPathName))
	} else {
		res.status(404);
		throw new Error('Firmware not found.')
	}
})


module.exports = { getFirmwares, getFirmwareById, uploadFirmware, downloadFirmware };