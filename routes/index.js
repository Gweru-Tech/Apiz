const express = require('express');
const router = express.Router();
const youtubeRoutes = require('./youtube');
const gptRoutes = require('./gpt');

// Current routes
router.use('/youtube', youtubeRoutes);
router.use('/gpt', gptRoutes);

// Placeholder for future APIs
// Uncomment and implement as needed:
// const instagramRoutes = require('./instagram');
// const tiktokRoutes = require('./tiktok');
// const spotifyRoutes = require('./spotify');
// const imageRoutes = require('./image');
// const textRoutes = require('./text');

// router.use('/instagram', instagramRoutes);
// router.use('/tiktok', tiktokRoutes);
// router.use('/spotify', spotifyRoutes);
// router.use('/image', imageRoutes);
// router.use('/text', textRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API documentation
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    api: 'Ntando Mods API',
    version: '1.0.0',
    description: 'Multi-purpose API for YouTube downloads, AI chat, and more',
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      youtube: [
        {
          path: '/youtube/mp3',
          method: 'GET',
          params: { url: 'YouTube video URL' },
          description: 'Download YouTube video as MP3',
          example: '/api/youtube/mp3?url=https://youtube.com/watch?v=VIDEO_ID'
        },
        {
          path: '/youtube/mp4',
          method: 'GET',
          params: { 
            url: 'YouTube video URL',
            quality: 'highest/lowest (optional)'
          },
          description: 'Download YouTube video as MP4',
          example: '/api/youtube/mp4?url=https://youtube.com/watch?v=VIDEO_ID&quality=highest'
        },
        {
          path: '/youtube/search',
          method: 'GET',
          params: { 
            q: 'search query',
            limit: 'number (optional, default: 10)'
          },
          description: 'Search YouTube videos',
          example: '/api/youtube/search?q=music&limit=5'
        },
        {
          path: '/youtube/info',
          method: 'GET',
          params: { url: 'YouTube video URL' },
          description: 'Get video information',
          example: '/api/youtube/info?url=https://youtube.com/watch?v=VIDEO_ID'
        }
      ],
      gpt: [
        {
          path: '/gpt/chat',
          method: 'POST',
          body: { 
            message: 'your message',
            conversationId: 'optional',
            model: 'gpt-3.5-turbo (optional)',
            maxTokens: '1000 (optional)'
          },
          description: 'Chat with GPT AI',
          example: {
            message: 'Hello, how are you?',
            conversationId: '12345'
          }
        },
        {
          path: '/gpt/conversation',
          method: 'GET',
          params: { conversationId: 'conversation ID' },
          description: 'Get conversation history',
          example: '/api/gpt/conversation?conversationId=12345'
        },
        {
          path: '/gpt/clear',
          method: 'POST',
          body: { conversationId: 'conversation ID' },
          description: 'Clear conversation history',
          example: {
            conversationId: '12345'
          }
        }
      ],
      utility: [
        {
          path: '/health',
          method: 'GET',
          description: 'Check API health status'
        },
        {
          path: '/docs',
          method: 'GET',
          description: 'Get API documentation'
        }
      ]
    },
    rateLimit: {
      window: '15 minutes',
      maxRequests: 100,
      message: 'Rate limiting is applied to prevent abuse'
    },
    support: {
      email: 'support@ntandomods.com',
      website: 'https://ntandomods.com',
      github: 'https://github.com/ntandomods'
    }
  });
});

module.exports = router;
