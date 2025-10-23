const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Get top headlines
router.get('/headlines', newsController.getHeadlines);

// Search news
router.get('/search', newsController.searchNews);

// Get news by category
router.get('/category/:category', newsController.getNewsByCategory);

module.exports = router;
