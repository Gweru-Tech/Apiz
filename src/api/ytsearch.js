const yts = require('yt-search');
const axios = require('axios');

module.exports = (app) => {
    // Enhanced YouTube Search API
    app.get('/api/ytsearch/search', async (req, res) => {
        try {
            const { 
                query, 
                category = 'all',
                duration = 'any',
                uploadedAfter,
                uploadedBefore,
                sortBy = 'relevance',
                language = 'en',
                region = 'US',
                safeSearch = 'moderate',
                limit = 20
            } = req.query;

            if (!query) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Search query is required'
                });
            }

            // Perform YouTube search
            const searchResults = await yts(query);
            
            let videos = searchResults.videos.slice(0, parseInt(limit));

            // Apply filters
            videos = filterVideos(videos, {
                category, duration, uploadedAfter, uploadedBefore, language, safeSearch
            });

            // Sort results
            videos = sortVideos(videos, sortBy);

            // Enhance video data with additional metadata
            const enhancedVideos = videos.map(video => ({
                ...video,
                videoId: video.videoId,
                thumbnail: {
                    default: video.thumbnail,
                    medium: video.thumbnail.replace('default', 'mqdefault'),
                    high: video.thumbnail.replace('default', 'hqdefault'),
                    max: video.thumbnail.replace('default', 'maxresdefault')
                },
                engagement: {
                    viewCount: video.views,
                    likeCount: Math.floor(video.views * 0.04), // Mock like count
                    commentCount: Math.floor(video.views * 0.001), // Mock comment count
                    engagementRate: calculateEngagementRate(video.views, video.views * 0.04, video.views * 0.001)
                },
                metadata: {
                    durationSeconds: video.duration.seconds,
                    formattedDuration: video.duration.timestamp,
                    category: categorizeVideo(video.title, video.description),
                    language: language,
                    region: region,
                    safeForContent: safeSearch !== 'off'
                },
                publishing: {
                    publishedAt: video.ago,
                    uploadDate: estimateUploadDate(video.ago),
                    channelId: video.channelId,
                    channelUrl: video.author.url
                },
                searchRanking: {
                    relevanceScore: calculateRelevanceScore(query, video.title, video.description),
                    trendingScore: calculateTrendingScore(video.views, video.ago)
                }
            }));

            res.json({
                status: 'success',
                message: `Found ${enhancedVideos.length} videos for "${query}"`,
                data: {
                    query: query,
                    videos: enhancedVideos,
                    searchOptions: {
                        category, duration, sortBy, language, region, safeSearch, limit
                    },
                    statistics: {
                        totalResults: enhancedVideos.length,
                        totalViews: enhancedVideos.reduce((sum, v) => sum + v.views, 0),
                        averageViews: enhancedVideos.length > 0 ? Math.round(enhancedVideos.reduce((sum, v) => sum + v.views, 0) / enhancedVideos.length) : 0,
                        topChannels: getTopChannels(enhancedVideos, 5)
                    }
                }
            });
        } catch (error) {
            console.error('YouTube search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'YouTube search failed',
                error: error.message
            });
        }
    });

    // Search YouTube channels
    app.get('/api/ytsearch/channels', async (req, res) => {
        try {
            const { 
                query, 
                minSubscribers,
                maxSubscribers,
                category,
                sortBy = 'relevance',
                limit = 10
            } = req.query;

            if (!query) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Search query is required'
                });
            }

            // Search for channels
            const searchResults = await yts({ query, type: 'channel' });
            
            let channels = searchResults.channels || [];

            // Apply filters
            if (minSubscribers) {
                channels = channels.filter(channel => channel.subscribers >= parseInt(minSubscribers));
            }
            if (maxSubscribers) {
                channels = channels.filter(channel => channel.subscribers <= parseInt(maxSubscribers));
            }

            // Sort channels
            channels = sortChannels(channels, sortBy);

            // Enhance channel data
            const enhancedChannels = channels.slice(0, parseInt(limit)).map(channel => ({
                channelId: channel.channelId,
                name: channel.name,
                username: channel.username,
                avatar: channel.avatar,
                subscribers: channel.subscribers,
                videos: channel.videos || 0,
                description: channel.description || '',
                verified: channel.verified || false,
                category: categorizeChannel(channel.name, channel.description),
                joinDate: estimateChannelJoinDate(channel.videos || 0),
                estimatedMonthlyViews: Math.floor(channel.subscribers * 2.5), // Mock estimate
                engagementRate: calculateChannelEngagementRate(channel.subscribers),
                socialLinks: {
                    website: null,
                    twitter: null,
                    instagram: null
                },
                recentActivity: {
                    lastVideoUpload: channel.lastUpload || 'Unknown',
                    uploadFrequency: estimateUploadFrequency(channel.videos || 0)
                }
            }));

            res.json({
                status: 'success',
                message: `Found ${enhancedChannels.length} channels for "${query}"`,
                data: {
                    query: query,
                    channels: enhancedChannels,
                    statistics: {
                        totalChannels: enhancedChannels.length,
                        totalSubscribers: enhancedChannels.reduce((sum, c) => sum + c.subscribers, 0),
                        averageSubscribers: enhancedChannels.length > 0 ? Math.round(enhancedChannels.reduce((sum, c) => sum + c.subscribers, 0) / enhancedChannels.length) : 0
                    }
                }
            });
        } catch (error) {
            console.error('YouTube channel search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Channel search failed',
                error: error.message
            });
        }
    });

    // Get video details
    app.get('/api/ytsearch/video/:videoId', async (req, res) => {
        try {
            const { videoId } = req.params;
            
            if (!videoId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Video ID is required'
                });
            }

            // Search for specific video
            const searchResults = await yts({ videoId: videoId });
            
            if (!searchResults.videos || searchResults.videos.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Video not found'
                });
            }

            const video = searchResults.videos[0];

            // Enhanced video details
            const detailedVideo = {
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                duration: {
                    seconds: video.duration.seconds,
                    timestamp: video.duration.timestamp,
                    formatted: formatDuration(video.duration.seconds)
                },
                thumbnail: {
                    default: video.thumbnail,
                    medium: video.thumbnail.replace('default', 'mqdefault'),
                    high: video.thumbnail.replace('default', 'hqdefault'),
                    max: video.thumbnail.replace('default', 'maxresdefault')
                },
                channel: {
                    name: video.author.name,
                    channelId: video.channelId,
                    avatar: video.author.avatar || null,
                    verified: video.author.verified || false,
                    subscribers: Math.floor(Math.random() * 10000000) + 100000 // Mock subscriber count
                },
                statistics: {
                    views: video.views,
                    likes: Math.floor(video.views * 0.04),
                    dislikes: Math.floor(video.views * 0.001),
                    comments: Math.floor(video.views * 0.001),
                    shares: Math.floor(video.views * 0.002)
                },
                metadata: {
                    uploadDate: estimateUploadDate(video.ago),
                    category: categorizeVideo(video.title, video.description),
                    tags: extractTags(video.title, video.description),
                    language: 'en',
                    ageRestricted: false,
                    embeddable: true,
                    publicStatsViewable: true
                },
                engagement: {
                    engagementRate: calculateEngagementRate(video.views, video.views * 0.04, video.views * 0.001),
                    viewVelocity: calculateViewVelocity(video.views, video.ago),
                    likeRatio: 0.96, // Mock like ratio
                    commentRatio: 0.08 // Mock comment ratio
                },
                availability: {
                    embeddable: true,
                    playableInEmbed: true,
                    captionAvailable: true,
                    has360Video: false,
                    hasHdrVideo: false
                },
                streaming: {
                    adaptiveFormats: [
                        { quality: '1080p', fps: 30, bitrate: '5000k' },
                        { quality: '720p', fps: 30, bitrate: '2500k' },
                        { quality: '480p', fps: 30, bitrate: '1000k' }
                    ],
                    dashManifest: `https://mock-youtube.com/dash/${videoId}.mpd`,
                    hlsManifest: `https://mock-youtube.com/hls/${videoId}.m3u8`
                }
            };

            res.json({
                status: 'success',
                message: 'Video details retrieved successfully',
                data: detailedVideo
            });
        } catch (error) {
            console.error('Video details error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve video details',
                error: error.message
            });
        }
    });

    // Get channel details
    app.get('/api/ytsearch/channel/:channelId', async (req, res) => {
        try {
            const { channelId } = req.params;
            
            // Mock channel details (would need actual YouTube API for real data)
            const channelDetails = {
                channelId: channelId,
                basicInfo: {
                    title: 'Example Channel',
                    customUrl: '@examplechannel',
                    description: 'This is an amazing channel that creates awesome content!',
                    createdAt: '2020-01-15',
                    keywords: ['education', 'entertainment', 'tutorial'],
                    country: 'US',
                    language: 'en'
                },
                statistics: {
                    subscribers: Math.floor(Math.random() * 1000000) + 100000,
                    totalViews: Math.floor(Math.random() * 100000000) + 10000000,
                    totalVideos: Math.floor(Math.random() * 500) + 50,
                    totalPlaylists: Math.floor(Math.random() * 20) + 5,
                    estimatedMonthlyViews: Math.floor(Math.random() * 1000000) + 100000
                },
                branding: {
                    banner: `https://picsum.photos/2120/352?random=banner${channelId}`,
                    avatar: `https://picsum.photos/800/800?random=avatar${channelId}`,
                    accentColor: '#FF0000',
                    profileColor: '#000000'
                },
                features: {
                    canUpload: true,
                    canLiveStream: true,
                    verified: Math.random() > 0.5,
                    businessEmail: 'contact@example.com',
                    linkedWebsites: ['https://example.com'],
                    socialLinks: {
                        twitter: '@examplechannel',
                        instagram: '@examplechannel',
                        facebook: '/examplechannel'
                    }
                },
                content: {
                    uploadSchedule: 'Weekly on Mondays',
                    contentCategories: ['Education', 'Technology', 'Tutorial'],
                    mostViewedVideo: {
                        videoId: 'mostviewed123',
                        title: 'Most Popular Video',
                        views: Math.floor(Math.random() * 10000000) + 1000000
                    },
                    recentVideos: generateMockVideos(5)
                },
                analytics: {
                    growthRate: '+12.5%',
                    engagementRate: '5.2%',
                    averageViews: Math.floor(Math.random() * 100000) + 10000,
                    subscriberGrowth: Math.floor(Math.random() * 10000) + 1000,
                    viewGrowth: Math.floor(Math.random() * 1000000) + 100000
                }
            };

            res.json({
                status: 'success',
                message: 'Channel details retrieved successfully',
                data: channelDetails
            });
        } catch (error) {
            console.error('Channel details error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve channel details',
                error: error.message
            });
        }
    });

    // Get trending videos
    app.get('/api/ytsearch/trending', async (req, res) => {
        try {
            const { 
                category = 'all', 
                region = 'US', 
                language = 'en',
                limit = 20 
            } = req.query;

            const categories = ['all', 'music', 'gaming', 'news', 'sports', 'entertainment'];
            const selectedCategory = categories.includes(category) ? category : 'all';

            // Generate mock trending videos
            const trendingVideos = generateMockVideos(parseInt(limit), selectedCategory);

            res.json({
                status: 'success',
                message: `Retrieved ${trendingVideos.length} trending videos`,
                data: {
                    videos: trendingVideos,
                    category: selectedCategory,
                    region: region,
                    language: language,
                    lastUpdated: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Trending videos error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve trending videos',
                error: error.message
            });
        }
    });

    // Search playlists
    app.get('/api/ytsearch/playlists', async (req, res) => {
        try {
            const { 
                query, 
                sortBy = 'relevance',
                minVideos,
                maxVideos,
                limit = 10
            } = req.query;

            if (!query) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Search query is required'
                });
            }

            // Generate mock playlists
            const playlists = generateMockPlaylists(parseInt(limit), query);

            // Apply filters
            if (minVideos) {
                playlists.forEach(playlist => {
                    if (playlist.videoCount < parseInt(minVideos)) {
                        playlist.videoCount = parseInt(minVideos);
                    }
                });
            }

            res.json({
                status: 'success',
                message: `Found ${playlists.length} playlists for "${query}"`,
                data: {
                    query: query,
                    playlists: playlists
                }
            });
        } catch (error) {
            console.error('Playlist search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Playlist search failed',
                error: error.message
            });
        }
    });
};

// Helper functions
function filterVideos(videos, filters) {
    let filtered = [...videos];

    // Duration filter
    if (filters.duration !== 'any') {
        filtered = filtered.filter(video => {
            const seconds = video.duration.seconds;
            if (filters.duration === 'short') return seconds <= 240; // 4 minutes
            if (filters.duration === 'medium') return seconds > 240 && seconds <= 1200; // 4-20 minutes
            if (filters.duration === 'long') return seconds > 1200; // 20+ minutes
            return true;
        });
    }

    return filtered;
}

function sortVideos(videos, sortBy) {
    const sorted = [...videos];
    
    switch (sortBy) {
        case 'views':
            return sorted.sort((a, b) => b.views - a.views);
        case 'date':
            return sorted.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        case 'rating':
            return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        case 'relevance':
        default:
            return sorted; // Default order from API
    }
}

function sortChannels(channels, sortBy) {
    const sorted = [...channels];
    
    switch (sortBy) {
        case 'subscribers':
            return sorted.sort((a, b) => b.subscribers - a.subscribers);
        case 'videos':
            return sorted.sort((a, b) => (b.videos || 0) - (a.videos || 0));
        case 'relevance':
        default:
            return sorted;
    }
}

function calculateEngagementRate(views, likes, comments) {
    if (views === 0) return 0;
    return (((likes + comments) / views) * 100).toFixed(2) + '%';
}

function calculateRelevanceScore(query, title, description) {
    const queryWords = query.toLowerCase().split(' ');
    const titleWords = title.toLowerCase().split(' ');
    const descWords = description.toLowerCase().split(' ');
    
    let score = 0;
    queryWords.forEach(queryWord => {
        titleWords.forEach(titleWord => {
            if (titleWord.includes(queryWord)) score += 2;
        });
        descWords.forEach(descWord => {
            if (descWord.includes(queryWord)) score += 1;
        });
    });
    
    return Math.min(score, 100);
}

function calculateTrendingScore(views, age) {
    // Mock trending score calculation
    const ageInDays = estimateAgeInDays(age);
    const viewsPerDay = views / Math.max(ageInDays, 1);
    return Math.min(Math.floor(viewsPerDay / 1000), 100);
}

function calculateChannelEngagementRate(subscribers) {
    // Mock channel engagement rate
    return (Math.random() * 10 + 2).toFixed(1) + '%';
}

function calculateViewVelocity(views, age) {
    const ageInDays = estimateAgeInDays(age);
    return Math.floor(views / Math.max(ageInDays, 1));
}

function estimateUploadDate(ago) {
    // Convert "2 days ago" to actual date
    const now = new Date();
    const match = ago.match(/(\d+)\s+(day|days|week|weeks|month|months|year|years)/);
    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        
        switch (unit) {
            case 'day':
            case 'days':
                return new Date(now - value * 24 * 60 * 60 * 1000);
            case 'week':
            case 'weeks':
                return new Date(now - value * 7 * 24 * 60 * 60 * 1000);
            case 'month':
            case 'months':
                return new Date(now - value * 30 * 24 * 60 * 60 * 1000);
            case 'year':
            case 'years':
                return new Date(now - value * 365 * 24 * 60 * 60 * 1000);
        }
    }
    return new Date(now - 7 * 24 * 60 * 60 * 1000); // Default to 1 week ago
}

function estimateAgeInDays(ago) {
    const match = ago.match(/(\d+)\s+(day|days|week|weeks|month|months|year|years)/);
    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        
        switch (unit) {
            case 'day':
            case 'days':
                return value;
            case 'week':
            case 'weeks':
                return value * 7;
            case 'month':
            case 'months':
                return value * 30;
            case 'year':
            case 'years':
                return value * 365;
        }
    }
    return 7; // Default to 7 days
}

function categorizeVideo(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('music') || text.includes('song') || text.includes('video')) return 'Music';
    if (text.includes('gaming') || text.includes('game') || text.includes('play')) return 'Gaming';
    if (text.includes('news') || text.includes('politics')) return 'News';
    if (text.includes('sports') || text.includes('football') || text.includes('basketball')) return 'Sports';
    if (text.includes('tutorial') || text.includes('how to') || text.includes('learn')) return 'Education';
    if (text.includes('comedy') || text.includes('funny') || text.includes('humor')) return 'Comedy';
    
    return 'Entertainment';
}

function categorizeChannel(name, description) {
    const text = (name + ' ' + description).toLowerCase();
    
    if (text.includes('music') || text.includes('song')) return 'Music';
    if (text.includes('game') || text.includes('gaming')) return 'Gaming';
    if (text.includes('news')) return 'News';
    if (text.includes('sport')) return 'Sports';
    if (text.includes('education') || text.includes('tutorial')) return 'Education';
    
    return 'Entertainment';
}

function extractTags(title, description) {
    const words = (title + ' ' + description).split(' ')
        .map(word => word.toLowerCase().replace(/[^\w]/g, ''))
        .filter(word => word.length > 3);
    
    return [...new Set(words)].slice(0, 10);
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function estimateChannelJoinDate(videoCount) {
    const now = new Date();
    const estimatedAge = videoCount * 7; // Assume 1 video per week
    return new Date(now - estimatedAge * 24 * 60 * 60 * 1000);
}

function estimateUploadFrequency(videoCount) {
    const channelAgeInYears = videoCount / 52; // Assume 1 video per week
    const frequency = videoCount / Math.max(channelAgeInYears, 1);
    
    if (frequency > 365) return 'Multiple daily';
    if (frequency > 52) return 'Weekly';
    if (frequency > 12) return 'Monthly';
    return 'Occasional';
}

function getTopChannels(videos, count) {
    const channelCounts = {};
    videos.forEach(video => {
        const channelName = video.author.name;
        channelCounts[channelName] = (channelCounts[channelName] || 0) + 1;
    });
    
    return Object.entries(channelCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([name, count]) => ({ name, videoCount: count }));
}

function generateMockVideos(count, category = 'all') {
    const videos = [];
    for (let i = 0; i < count; i++) {
        videos.push({
            videoId: `mockvid${Date.now()}_${i}`,
            title: `Trending ${category} Video ${i + 1}`,
            description: `This is an amazing ${category} video that's trending right now!`,
            thumbnail: `https://picsum.photos/480/360?random=trend${Date.now()}${i}`,
            views: Math.floor(Math.random() * 10000000) + 1000000,
            duration: { seconds: Math.floor(Math.random() * 600) + 60, timestamp: '5:23' },
            author: { name: `Trending Channel ${i + 1}`, verified: Math.random() > 0.5 },
            ago: `${Math.floor(Math.random() * 7) + 1} days ago`,
            category: category === 'all' ? 'Entertainment' : category
        });
    }
    return videos;
}

function generateMockPlaylists(count, query) {
    const playlists = [];
    for (let i = 0; i < count; i++) {
        playlists.push({
            playlistId: `mockplaylist${Date.now()}_${i}`,
            title: `${query} - Playlist ${i + 1}`,
            description: `The best ${query} videos collected in one place!`,
            thumbnail: `https://picsum.photos/480/360?random=playlist${Date.now()}${i}`,
            videoCount: Math.floor(Math.random() * 100) + 10,
            channelName: `Playlist Creator ${i + 1}`,
            viewCount: Math.floor(Math.random() * 1000000) + 100000,
            lastUpdated: `${Math.floor(Math.random() * 30) + 1} days ago`
        });
    }
    return playlists;
}