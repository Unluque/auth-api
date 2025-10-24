const express = require('express');
const RefreshToken = require('../models/RefreshToken');

const router = express.Router();

router.post('/', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh Token required' });
  }

  try {
    const deletedToken = await RefreshToken.findOneAndDelete({ token: refreshToken.trim() });
    if (!deletedToken) {
      //console.warn(`Attempted to delete non-existent refresh token: ${refreshToken}`);
      return res.status(404).json({ error: 'Refresh token not found' });
    }
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;