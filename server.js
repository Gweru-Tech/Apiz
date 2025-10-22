require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Ntando Mods API',
    version: '1.0.0',
    endpoints: {
      youtube: {
        mp3: '/api/youtube/mp3?url=VIDEO_URL',
        mp4: '/api/youtube/mp4?url=VIDEO_URL',
        search: '/api/youtube/search?q=QUERY'
      },
      gpt: {
        chat: '/api/gpt/chat (POST with body: {message: "your message"})'
      }
    },
    documentation: '/api/docs'
  });
});

// API Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Ntando Mods API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
