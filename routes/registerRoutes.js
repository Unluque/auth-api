const express = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { isEmailValid, isPasswordSafe, doPasswordsMatch } = require('../utils/validation');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, email, password, confirmationPassword } = req.body;

  if (!username || !email || !password || !confirmationPassword) {
    return res.status(400).json({ error: 'Missing required fields: { username, email, password, confirmationPassword }' });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'Email must be in a valid format' });
  }

  if (!doPasswordsMatch(password, confirmationPassword)) {
    return res.status(400).json({ error: 'Password and confirmation password do not match' });
  }

  if (!isPasswordSafe(password)) {
    return res.status(400).json({ error: 'Password is not safe. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    const verificationToken = uuidv4();
    const verificationTokenExpires = new Date(Date.now() + process.env.REGISTER_TOKEN_EXPIRATION_MINUTES * 60 * 1000);

    user = new User({
      username,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully. Verify your account with the provided token.',
      verification_token: verificationToken,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;