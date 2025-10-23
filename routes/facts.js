const express = require('express');
const router = express.Router();
const factsController = require('../controllers/factsController');

// Get random fact
router.get('/random', factsController.getRandomFact);

// Get fact by category
router.get('/category/:category', factsController.getFactByCategory);

module.exports = router;
