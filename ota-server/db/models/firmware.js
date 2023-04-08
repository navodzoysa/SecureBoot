const mongoose = require("mongoose");

const schema = mongoose.Schema({
	firmwareId: String,
	firmwareName: String,
	firmwareSupportedDevice: String,
	firmwareVersion: String,
	firmwareBinary: String
})

module.exports = mongoose.model("Firmware", schema);