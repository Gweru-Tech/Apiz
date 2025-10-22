const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');
const { 
  chatWithGPT, 
  clearConversation, 
  getConversation 
} = require('../controllers/gptController');

// Apply rate limiting
router.use(rateLimiter);

router.post('/chat', chatWithGPT);
router.get('/conversation', getConversation);
router.post('/clear', clearConversation);

module.exports = router;
