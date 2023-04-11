const mongoose = require("mongoose");

const schema = mongoose.Schema({
	userEmail: {
		type: String,
		required: true,
	},
	userPassword: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: new Date(),
	},
})

module.exports = mongoose.model("User", schema);