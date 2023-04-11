const mongoose = require("mongoose");

const schema = mongoose.Schema({
	deviceId: String,
	deviceName: String,
	deviceStatus: String,
	deviceFirmwareVersion: String,
	lastActive: {
		type: Date,
		default: new Date(),
	},
})

module.exports = mongoose.model("Device", schema);