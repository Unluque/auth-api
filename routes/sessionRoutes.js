const express = require('express');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');

const router = express.Router();

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh Token required' });
  }

  try {
    const storedRefreshToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedRefreshToken) {
      return res.status(403).json({ error: 'Invalid or expired Refresh Token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    res.status(200).json({
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error(error.message);
    res.status(403).json({ error: 'Invalid or expired Refresh Token' });
  }
});

module.exports = router;