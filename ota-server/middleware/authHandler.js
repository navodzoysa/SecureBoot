const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../db/models/user');

const authenticatedRoute = asyncHandler(async (req, res, next) => {
	let accessToken;
	
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			accessToken = req.headers.authorization.split(' ')[1];
			const decryptToken = jwt.verify(accessToken, process.env.JWT_KEY);
			req.user = await User.findById(decryptToken.id).select('-userPassword');
			next();
		} catch (err) {
			console.log(err);
			res.status(401);
			throw new Error('Unauthorized to access this API.');
		}
	}
	if (!accessToken) {
		res.status(401);
		throw new Error('No token found! Unauthorized to access this API.');
	}
})

module.exports = { authenticatedRoute };