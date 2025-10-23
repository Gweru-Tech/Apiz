const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Generate AI images
router.post('/generate', imageController.generateImage);

// Search images
router.get('/search', imageController.searchImages);

// Get random image
router.get('/random', imageController.getRandomImage);

module.exports = router;
