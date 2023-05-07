const mongoose = require("mongoose");

const schema = mongoose.Schema({
	deviceId: {
		type: String,
	},
	deviceName: {
		type: String,
		required: true,
	},
	deviceType: {
		type: String,
		required: true,
	},
	preSharedKey: {
		type: String,
		required: true,
	},
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