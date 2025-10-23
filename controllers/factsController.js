const axios = require('axios');
const { handleError } = require('../utils/helper');

const FACT_CATEGORIES = {
  random: 'random',
  science: 'science',
  history: 'history',
  animals: 'animals',
  technology: 'technology'
};

const FACTS_DATABASE = {
  science: [
    'Water can boil and freeze at the same time, called the triple point.',
    'A teaspoon of neutron star would weigh 6 billion tons.',
    'Hawaii moves 7.5cm closer to Alaska every year.'
  ],
  history: [
    'Cleopatra lived closer to the Moon landing than to the construction of the Great Pyramid.',
    'Oxford University is older than the Aztec Empire.',
    'Mammoths were still alive when the pyramids were being built.'
  ],
  animals: [
    'Octopuses have three hearts.',
    'A group of flamingos is called a flamboyance.',
    'Butterflies can taste with their feet.'
  ],
  technology: [
    'The first computer mouse was made of wood.',
    'The first alarm clock could only ring at 4 AM.',
    'Email existed before the World Wide Web.'
  ]
};

exports.getRandomFact = async (req, res) => {
  try {
    // Using an external API
    const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');

    res.json({
      success: true,
      data: {
        fact: response.data.text,
        source: 'Useless Facts API'
      }
    });
  } catch (error) {
    // Fallback to local facts
    const categories = Object.keys(FACTS_DATABASE);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const facts = FACTS_DATABASE[randomCategory];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    res.json({
      success: true,
      data: {
        fact: randomFact,
        category: randomCategory,
        source: 'Local Database'
      }
    });
  }
};

exports.getFactByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!FACTS_DATABASE[category]) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Choose from: ${Object.keys(FACTS_DATABASE).join(', ')}`
      });
    }

    const facts = FACTS_DATABASE[category];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    res.json({
      success: true,
      data: {
        fact: randomFact,
        category
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch fact');
  }
};
