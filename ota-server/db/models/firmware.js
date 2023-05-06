const mongoose = require("mongoose");

const schema = mongoose.Schema({
	firmwareName: String,
	firmwareSupportedDevice: String,
	firmwareVersion: String,
	firmwareAltVersion: Number,
	firmwareBinaryPath: String,
	firmwareBinaryPathName: String,
	firmwareMimeType: String,
	firmwaredestination: String,
	firmwareSize: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
},
{
	timestamps: true	
})

schema.set("toJSON", {
  transform: function (doc, ret, options) {
	delete ret.firmwareBinaryPath;
	delete ret.firmwareBinaryPathName;
	delete ret.firmwaredestination;
	return ret
  },
})

module.exports = mongoose.model("Firmware", schema);