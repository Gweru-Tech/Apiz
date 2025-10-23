const axios = require('axios');
const { handleError, validateRequiredParams } = require('../utils/helper');

exports.generateImage = async (req, res) => {
  try {
    const { prompt, size = '512x512' } = req.body;
    
    const validation = validateRequiredParams({ prompt }, ['prompt']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Example using Unsplash API or similar
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query: prompt, per_page: 1 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    res.json({
      success: true,
      data: {
        prompt,
        image_url: response.data.results[0]?.urls?.regular,
        size
      }
    });
  } catch (error) {
    handleError(res, error, 'Image generation failed');
  }
};

exports.searchImages = async (req, res) => {
  try {
    const { query, page = 1, per_page = 10 } = req.query;
    
    const validation = validateRequiredParams({ query }, ['query']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, page, per_page },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    res.json({
      success: true,
      data: {
        total: response.data.total,
        images: response.data.results.map(img => ({
          id: img.id,
          url: img.urls.regular,
          thumbnail: img.urls.thumb,
          description: img.description,
          author: img.user.name
        }))
      }
    });
  } catch (error) {
    handleError(res, error, 'Image search failed');
  }
};

exports.getRandomImage = async (req, res) => {
  try {
    const { category = 'nature' } = req.query;

    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: { query: category },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    res.json({
      success: true,
      data: {
        id: response.data.id,
        url: response.data.urls.regular,
        thumbnail: response.data.urls.thumb,
        description: response.data.description,
        author: response.data.user.name
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to get random image');
  }
};
