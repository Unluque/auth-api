const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRouter');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Apply API key middleware to all routes except those explicitly excluded
app.use((req, res, next) => {
  apiKeyMiddleware(req, res, next);
});

// API routes
app.use('/api/auth', apiRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Auth API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});