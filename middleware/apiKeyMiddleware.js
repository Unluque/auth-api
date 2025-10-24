require('dotenv').config();

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or missing API key' });
  }
  next();
};

module.exports = apiKeyMiddleware;