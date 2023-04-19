const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../db/models/user');
const secretPepper = Buffer.alloc(16, process.env.SECRET_KEY);
const { COOKIE_OPTIONS , generateAccessToken, generateRefreshToken } = require('../middleware/authHandler');

const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) { 
		res.status(400);
		throw new Error('Email and password required')
	}
	if (password.length < 8) { 
		res.status(400);
		throw new Error('Password must be atleast 8 characters');
	}
	const user = await User.findOne({ userEmail: email });
	if (user) { 
		res.status(400);
		throw new Error('User already exists');
	}
	const hash = await argon2.hash(password, { secret: secretPepper });
	const newUser = new User({
		userEmail: email,
		userPassword: hash,
	})
	const refreshToken = generateRefreshToken(newUser._id);
	newUser.refreshToken.push({ refreshToken });
	const userSaved = await newUser.save();
	if (userSaved) {
		res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
		res.status(201).json({
			id: userSaved._id,
			email: userSaved.userEmail,
			accessToken: generateAccessToken(userSaved._id),
		});
	} else { 
		res.status(400);
		throw new Error('Error occured while registering user. Please try again');
	}
})

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) { 
		res.status(400);
		throw new Error('Email or password is missing');
	}
	const user = await User.findOne({ userEmail: email });
	if (!user) { 
		res.status(404);
		throw new Error('User not found');
	}
	if (await argon2.verify(user.userPassword, password, { secret: secretPepper })) {
		const refreshToken = generateRefreshToken(user._id);
		user.refreshToken.push({ refreshToken });
		const userSaved = await user.save();
		res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
		res.status(201).json({
			id: userSaved._id,
			email: userSaved.userEmail,
			accessToken: generateAccessToken(userSaved._id),
		});
	} else {
		res.status(400);
		throw new Error('Password is incorrect');
	}
})

const logoutUser = asyncHandler(async (req, res) => {
	const { signedCookies = {} } = req;
	const { refreshToken } = signedCookies;
	const user = await User.findById(req.user.id);
	const tokenIndex = user.refreshToken.findIndex(
        item => item.refreshToken === refreshToken
	)
	try {
		if (tokenIndex !== -1) {
			let refreshTokenList = user.refreshToken;
			refreshTokenList.splice(tokenIndex, 1);
			user.refreshTokenList = refreshTokenList;
			const savedUser = await user.save();
			res.clearCookie('refreshToken', COOKIE_OPTIONS);
			res.status(200).json({ message: 'Successfully logged out user ' + savedUser.userEmail })
		} else {
			res.status(400);
			throw new Error('Error logging out user.');
		}
	} catch (err) {
		res.status(400)
		throw new Error('Error logging out user.')
	}
})

const generateNewRefreshToken = asyncHandler(async (req, res) => {
	const { signedCookies = {} } = req;
	const { refreshToken } = signedCookies;
	if (refreshToken) {
		try {
			const decryptedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
			const user = await User.findById(decryptedToken.id);
			if (user) {
				const tokenIndex = user.refreshToken.findIndex(
					item => item.refreshToken === refreshToken
				)
				if (tokenIndex !== -1) {
					const newRefreshToken = generateRefreshToken(user._id);
					user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
					const userSaved = await user.save();
					res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
					res.status(201).json({
						accessToken: generateAccessToken(userSaved._id),
					});
				} else {
					res.status(400);
					throw new Error('No refresh token found for user! Unauthorized to access this API.');
				}
			} else {
				res.status(400);
				throw new Error('No user found for given token! Unauthorized to access this API.');
			}
		} catch (err) {
			res.status(500);
			throw new Error('Error occured while refreshing token.');
		}
	} else {
		res.status(400);
		throw new Error('No refresh token found! Unauthorized to access this API.');
	}
})

const getCurrentUser = asyncHandler(async (req, res) => {
	const { _id, userEmail } = await User.findById(req.user.id);

	res.status(200).json({
		id: _id,
		email: userEmail,
	})
})

module.exports = { registerUser, loginUser, logoutUser, generateNewRefreshToken, getCurrentUser }