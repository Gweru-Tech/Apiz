const express = require('express');
const router = express.Router();

const gptRoutes = require('./gpt');
const youtubeRoutes = require('./youtube');
const imageRoutes = require('./image');
const weatherRoutes = require('./weather');
const translationRoutes = require('./translation');
const musicRoutes = require('./music');
const newsRoutes = require('./news');
const factsRoutes = require('./facts');

// Mount routes
router.use('/gpt', gptRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/image', imageRoutes);
router.use('/weather', weatherRoutes);
router.use('/translate', translationRoutes);
router.use('/music', musicRoutes);
router.use('/news', newsRoutes);
router.use('/facts', factsRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ntando Mods API',
    version: '1.0.0',
    endpoints: {
      gpt: '/api/gpt',
      youtube: '/api/youtube',
      image: '/api/image',
      weather: '/api/weather',
      translate: '/api/translate',
      music: '/api/music',
      news: '/api/news',
      facts: '/api/facts'
    }
  });
});

module.exports = router;
