const axios = require('axios');
const { handleError, validateRequiredParams } = require('../utils/helper');

exports.searchMusic = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    const validation = validateRequiredParams({ query }, ['query']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Example using iTunes API
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: query,
        media: 'music',
        limit
      }
    });

    const tracks = response.data.results.map(track => ({
      id: track.trackId,
      name: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      artwork: track.artworkUrl100,
      preview_url: track.previewUrl,
      price: track.trackPrice,
      duration: track.trackTimeMillis
    }));

    res.json({
      success: true,
      data: {
        count: tracks.length,
        tracks
      }
    });
  } catch (error) {
    handleError(res, error, 'Music search failed');
  }
};

exports.getLyrics = async (req, res) => {
  try {
    const { artist, title } = req.query;
    
    const validation = validateRequiredParams({ artist, title }, ['artist', 'title']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Using lyrics.ovh API
    const response = await axios.get(`https://api.lyrics.ovh/v1/$${artist}/$$ {title}`);

    res.json({
      success: true,
      data: {
        artist,
        title,
        lyrics: response.data.lyrics
      }
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Lyrics not found'
      });
    }
    handleError(res, error, 'Failed to fetch lyrics');
  }
};

exports.downloadMusic = async (req, res) => {
  try {
    const { url } = req.query;
    
    const validation = validateRequiredParams({ url }, ['url']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Note: Implement proper music download logic with ytdl-core or similar
    res.json({
      success: true,
      message: 'Music download endpoint',
      data: {
        url,
        note: 'Please ensure you have rights to download this content'
      }
    });
  } catch (error) {
    handleError(res, error, 'Music download failed');
  }
};
