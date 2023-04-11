const mongoose = require("mongoose");

const schema = mongoose.Schema({
	deviceId: String,
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

module.exports = mongoose.model("Device", schema);