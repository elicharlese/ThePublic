const express = require('express');
const mongoose = require('./mongo'); // This ensures mongo.js is executed and connected
const bodyParser = require('body-parser');
const networkSettingsRoutes = require('./routes/networkSettingsRoutes');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use Helmet to set various HTTP headers for app security
app.use(helmet());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logger
app.use(morgan('combined'));

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.json());

// Use the network settings routes
app.use('/api/network-settings', networkSettingsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});