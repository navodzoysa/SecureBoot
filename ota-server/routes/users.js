var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const User = require('../db/models/user');
const secretPepper = Buffer.alloc(16, process.env.SECRET_KEY);

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { 
    return res.status(400).json('Email and password required');
  }
  if (password.length < 8) { 
    return res.status(400).json('Password must be atleast 8 characters');
  }
  const user = await User.findOne({ userEmail: email });
  if (user) { 
    return res.status(400).json('User already exists');
  }
  const hash = await argon2.hash(password, { secret: secretPepper });
  const newUser = new User({
    userEmail: email,
    userPassword: hash,
  })
  const userSaved = await newUser.save();
  if (userSaved) {
    res.json('Successfully registered user with email - ' + userSaved.userEmail);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { 
    return res.status(400).json('Email or password is missing');
  }
  const user = await User.findOne({ userEmail: email });
  if (!user) { 
    return res.status(404).json('User not found');
  }
  try {
    if (await argon2.verify(user.userPassword, password, { secret: secretPepper })) {
      return res.json('Successfully logged in');
    } else {
      return res.json('Password is incorrect');
    }
  } catch (err) {
    return res.status(400).json('Error logging in');
  }
});

module.exports = router;
