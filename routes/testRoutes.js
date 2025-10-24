const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/protected', protect, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.id}, you have access to protected data!` });
});

module.exports = router;