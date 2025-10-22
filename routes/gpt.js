const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');
const { chatWithGPT } = require('../controllers/gptController');

// Apply rate limiting
router.use(rateLimiter);

router.post('/chat', chatWithGPT);

module.exports = router;
