const express = require('express');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken'); // Import RefreshToken model

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Account has not been verified yet' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    const newRefreshToken = new RefreshToken({
      user: user._id,
      token: refreshToken,
    });
    await newRefreshToken.save();

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;