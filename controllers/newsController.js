const axios = require('axios');
const { handleError } = require('../utils/helper');

const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

exports.getHeadlines = async (req, res) => {
  try {
    const { country = 'us', page = 1, pageSize = 10 } = req.query;

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country,
        page,
        pageSize,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    res.json({
      success: true,
      data: {
        total: response.data.totalResults,
        articles: response.data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          published_at: article.publishedAt,
          source: article.source.name,
          author: article.author
        }))
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch headlines');
  }
};

exports.searchNews = async (req, res) => {
  try {
    const { query, from, to, sortBy = 'publishedAt', page = 1, pageSize = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required'
      });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        from,
        to,
        sortBy,
        page,
        pageSize,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    res.json({
      success: true,
      data: {
        total: response.data.totalResults,
        articles: response.data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          published_at: article.publishedAt,
          source: article.source.name,
          author: article.author
        }))
      }
    });
  } catch (error) {
    handleError(res, error, 'News search failed');
  }
};

exports.getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { country = 'us', page = 1, pageSize = 10 } = req.query;

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Choose from: ${CATEGORIES.join(', ')}`
      });
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category,
        country,
        page,
        pageSize,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    res.json({
      success: true,
      data: {
        category,
        total: response.data.totalResults,
        articles: response.data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          published_at: article.publishedAt,
          source: article.source.name
        }))
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch news by category');
  }
};
