const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/refresh-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Invalid or missing token' });
  }

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: 'Token not associated with any user' });
    }

    if (user.verificationTokenExpires < Date.now()) {
      return res.status(410).json({ error: 'Verification token has expired' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Account verified successfully',
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

router.post('/access-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({ message: 'Access token is valid', user: decoded });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid access token' });
    }
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;