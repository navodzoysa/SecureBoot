const mongoose = require("mongoose");

const schema = mongoose.Schema({
	firmwareId: String,
	firmwareName: String,
	firmwareSupportedDevice: String,
	firmwareVersion: String,
	firmwareBinary: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
},
{
	timestamps: true	
})

module.exports = mongoose.model("Firmware", schema);