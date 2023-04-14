const mongoose = require("mongoose");

const Session = mongoose.Schema({
  refreshToken: {
    type: String,
    default: "",
  },
})

const schema = mongoose.Schema({
	userEmail: {
		type: String,
		required: true,
	},
	userPassword: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: [Session],
	},
},
{
	timestamps: true	
})

module.exports = mongoose.model("User", schema);