const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../db/models/user');
const dev = process.env.NODE_ENV !== "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !dev,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: 'Lax',
}

const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: eval(process.env.SESSION_EXPIRY) })
}

const generateRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_REFRESH_KEY, { expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY) })
}

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

module.exports = { COOKIE_OPTIONS , generateAccessToken, generateRefreshToken, authenticatedRoute };