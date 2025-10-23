const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

// Search music
router.get('/search', musicController.searchMusic);

// Get lyrics
router.get('/lyrics', musicController.getLyrics);

// Download music
router.get('/download', musicController.downloadMusic);

module.exports = router;
