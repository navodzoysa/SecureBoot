const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../db/models/user');
const secretPepper = Buffer.alloc(16, process.env.SECRET_KEY);

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
	const userSaved = await newUser.save();
	if (userSaved) {
		res.status(201).json({
			id: userSaved._id,
			email: userSaved.userEmail,
			token: generateToken(userSaved._id),
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
		res.status(201).json({
			id: user._id,
			email: user.userEmail,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Password is incorrect');
	}
})

const getCurrentUser = asyncHandler(async (req, res) => {
	const { _id, userEmail } = await User.findById(req.user.id);

	res.status(200).json({
		id: _id,
		email: userEmail,
	})
})
 
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '1d' })
}

module.exports = { registerUser, loginUser, getCurrentUser }