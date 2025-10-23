const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');

// Translate text
router.post('/translate', translationController.translateText);

// Get supported languages
router.get('/languages', translationController.getSupportedLanguages);

// Detect language
router.post('/detect', translationController.detectLanguage);

module.exports = router;
