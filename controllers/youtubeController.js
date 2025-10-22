const ytdl = require('ytdl-core');
const youtubeSearch = require('youtube-search-api');

// Download YouTube video as MP3
exports.downloadMP3 = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL parameter is required'
      });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    const info = await ytdl.getInfo(url);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

    if (audioFormats.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No audio formats available'
      });
    }

    res.json({
      success: true,
      data: {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        duration: info.videoDetails.lengthSeconds,
        thumbnail: info.videoDetails.thumbnails[0].url,
        downloadUrl: audioFormats[0].url,
        format: 'mp3',
        quality: audioFormats[0].audioBitrate + 'kbps'
      }
    });

  } catch (error) {
    next(error);
  }
};

// Download YouTube video as MP4
exports.downloadMP4 = async (req, res, next) => {
  try {
    const { url, quality = 'highest' } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL parameter is required'
      });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality });

    res.json({
      success: true,
      data: {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        duration: info.videoDetails.lengthSeconds,
        thumbnail: info.videoDetails.thumbnails[0].url,
        downloadUrl: format.url,
        format: 'mp4',
        quality: format.qualityLabel,
        resolution: format.width + 'x' + format.height
      }
    });

  } catch (error) {
    next(error);
  }
};

// Search YouTube
exports.searchYouTube = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter (q) is required'
      });
    }

    const results = await youtubeSearch.GetListByKeyword(q, false, parseInt(limit));

    const formattedResults = results.items.map(item => ({
      id: item.id,
      title: item.title,
      channel: item.channelTitle,
      duration: item.length?.simpleText || 'N/A',
      views: item.viewCount || 'N/A',
      thumbnail: item.thumbnail?.thumbnails[0]?.url,
      url: `https://www.youtube.com/watch?v=${item.id}`
    }));

    res.json({
      success: true,
      count: formattedResults.length,
      data: formattedResults
    });

  } catch (error) {
    next(error);
  }
};

// Get video info
exports.getVideoInfo = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL parameter is required'
      });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    const info = await ytdl.getInfo(url);

    res.json({
      success: true,
      data: {
        title: info.videoDetails.title,
        description: info.videoDetails.description,
        author: info.videoDetails.author.name,
        duration: info.videoDetails.lengthSeconds,
        views: info.videoDetails.viewCount,
        likes: info.videoDetails.likes,
        thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
        uploadDate: info.videoDetails.uploadDate,
        category: info.videoDetails.category
      }
    });

  } catch (error) {
    next(error);
  }
};
