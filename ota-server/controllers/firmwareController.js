const asyncHandler = require('express-async-handler');
const Firmware = require('../db/models/firmware');

const getFirmwares = asyncHandler(async (req, res) => {
    const data = await Firmware.find({ user: req.user.id });
	if (data && data.length > 0) {
		res.json(data);
	} else {
		res.status(500);
		throw new Error('Devices not found for current user.')
	}
})

const uploadFirmware = asyncHandler(async (req, res) => {
	res.json('invoked upload');
})

const downloadFirmware = asyncHandler(async (req, res) => {
	res.json('invoked download');
})


module.exports = { getFirmwares, uploadFirmware, downloadFirmware };