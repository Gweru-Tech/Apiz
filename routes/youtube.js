const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');
const {
  downloadMP3,
  downloadMP4,
  searchYouTube,
  getVideoInfo
} = require('../controllers/youtubeController');

// Apply rate limiting
router.use(rateLimiter);

router.get('/mp3', downloadMP3);
router.get('/mp4', downloadMP4);
router.get('/search', searchYouTube);
router.get('/info', getVideoInfo);

module.exports = router;
