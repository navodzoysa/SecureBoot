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
},
{
	timestamps: true	
})

module.exports = mongoose.model("User", schema);