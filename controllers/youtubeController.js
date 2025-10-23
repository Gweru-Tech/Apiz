const axios = require('axios');
const { handleError, validateRequiredParams } = require('../utils/helper');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

exports.searchVideos = async (req, res) => {
  try {
    const { query, maxResults = 10, order = 'relevance' } = req.query;
    
    const validation = validateRequiredParams({ query }, ['query']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'YouTube API key not configured'
      });
    }

    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        q: query,
        maxResults,
        order,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    res.json({
      success: true,
      data: {
        total: response.data.pageInfo.totalResults,
        videos
      }
    });
  } catch (error) {
    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'YouTube API quota exceeded or invalid API key'
      });
    }
    handleError(res, error, 'YouTube search failed');
  }
};

exports.getVideoDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const validation = validateRequiredParams({ id }, ['id']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'YouTube API key not configured'
      });
    }

    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const video = response.data.items[0];
    
    res.json({
      success: true,
      data: {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        channel: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.high.url,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount,
        url: `https://www.youtube.com/watch?v=${video.id}`
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to get video details');
  }
};

exports.downloadVideo = async (req, res) => {
  try {
    const { url } = req.query;
    
    const validation = validateRequiredParams({ url }, ['url']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Note: For actual video download, you would need ytdl-core or similar
    // This is a placeholder response
    res.json({
      success: true,
      message: 'Video download endpoint',
      data: {
        url,
        note: 'Please use a dedicated YouTube downloader service for actual downloads'
      }
    });
  } catch (error) {
    handleError(res, error, 'Video download failed');
  }
};
