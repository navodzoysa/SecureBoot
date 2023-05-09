const mongoose = require("mongoose");

const schema = mongoose.Schema({
	deviceId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Device'
	},
	deviceName: String,
	deviceStatus: String,
	deviceFirmwareVersion: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
},
{
	timestamps: true	
})

module.exports = mongoose.model("DeviceInfo", schema);