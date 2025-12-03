const axios = require('axios');
const yts = require('yt-search');

module.exports = (app) => {
    // YouTube video search
    app.get('/api/youtube/search', async (req, res) => {
        try {
            const { query } = req.query;
            
            if (!query) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Query parameter is required'
                });
            }

            const searchResults = await yts(query);
            
            res.json({
                status: 'success',
                message: 'Search completed successfully',
                data: {
                    query: query,
                    results: searchResults.videos.slice(0, 10).map(video => ({
                        id: video.videoId,
                        title: video.title,
                        description: video.description.substring(0, 200) + '...',
                        thumbnail: video.thumbnail,
                        duration: video.duration.timestamp,
                        views: video.views,
                        uploaded: video.ago,
                        author: video.author.name,
                        url: video.url
                    }))
                }
            });
        } catch (error) {
            console.error('YouTube search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to search YouTube',
                error: error.message
            });
        }
    });

    // Get video info
    app.get('/api/youtube/info', async (req, res) => {
        try {
            const { url } = req.query;
            
            if (!url) {
                return res.status(400).json({
                    status: 'error',
                    message: 'URL parameter is required'
                });
            }

            // Extract video ID from URL
            const videoId = extractVideoId(url);
            if (!videoId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid YouTube URL'
                });
            }

            const searchResults = await yts({ videoId: videoId });
            
            if (!searchResults.videos.length) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Video not found'
                });
            }

            const video = searchResults.videos[0];
            
            res.json({
                status: 'success',
                message: 'Video info retrieved successfully',
                data: {
                    id: video.videoId,
                    title: video.title,
                    description: video.description,
                    thumbnail: video.thumbnail,
                    duration: video.duration.timestamp,
                    durationSeconds: video.duration.seconds,
                    views: video.views,
                    uploaded: video.ago,
                    author: {
                        name: video.author.name,
                        url: video.author.url
                    },
                    url: video.url,
                    publishedAt: video.publishedAt
                }
            });
        } catch (error) {
            console.error('YouTube info error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to get video info',
                error: error.message
            });
        }
    });

    // Download video info (returns download options)
    app.get('/api/youtube/download', async (req, res) => {
        try {
            const { url, format } = req.query;
            
            if (!url) {
                return res.status(400).json({
                    status: 'error',
                    message: 'URL parameter is required'
                });
            }

            const videoId = extractVideoId(url);
            if (!videoId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid YouTube URL'
                });
            }

            const searchResults = await yts({ videoId: videoId });
            
            if (!searchResults.videos.length) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Video not found'
                });
            }

            const video = searchResults.videos[0];
            
            // Return download options (in a real implementation, you would use ytdl-core)
            const downloadOptions = {
                formats: [
                    { quality: '360p', format: 'mp4', size: '~20MB' },
                    { quality: '720p', format: 'mp4', size: '~50MB' },
                    { quality: '1080p', format: 'mp4', size: '~100MB' },
                    { quality: 'audio', format: 'mp3', size: '~5MB' }
                ]
            };

            res.json({
                status: 'success',
                message: 'Download options retrieved successfully',
                data: {
                    video: {
                        id: video.videoId,
                        title: video.title,
                        duration: video.duration.timestamp
                    },
                    downloadOptions: downloadOptions,
                    note: 'This is a demo. Actual download functionality requires ytdl-core.'
                }
            });
        } catch (error) {
            console.error('YouTube download error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to get download options',
                error: error.message
            });
        }
    });
};

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}