const asyncHandler = require('express-async-handler');
require('dotenv').config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Make a call to the /verify/access-token endpoint
      const response = await fetch('http://localhost:5000/api/auth/verify/access-token', { // Assuming the API is running on localhost:5000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        req.user = data.user;
        next();
      } else {
        res.status(response.status);
        throw new Error(data.error || 'Not authorized, token failed');
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };