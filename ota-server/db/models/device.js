const mongoose = require("mongoose");

const schema = mongoose.Schema({
	deviceId: String,
	deviceName: String,
	deviceStatus: String,
	deviceFirmwareVersion: String,
	lastActive: String,
})

module.exports = mongoose.model("Device", schema);