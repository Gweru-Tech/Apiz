const crypto = require('crypto');

// In-memory storage for demo purposes (in production, use a database)
const urlDatabase = {};
const urlStats = {};

module.exports = (app) => {
    // Create short URL
    app.post('/api/urlshortener/shorten', (req, res) => {
        try {
            const { url, customAlias, expiresIn } = req.body;
            
            if (!url) {
                return res.status(400).json({
                    status: 'error',
                    message: 'URL parameter is required'
                });
            }

            // Validate URL format
            try {
                new URL(url);
            } catch (_) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid URL format'
                });
            }

            let shortCode;
            
            // Use custom alias if provided
            if (customAlias) {
                if (urlDatabase[customAlias]) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Custom alias already exists'
                    });
                }
                shortCode = customAlias;
            } else {
                // Generate random short code
                do {
                    shortCode = generateShortCode();
                } while (urlDatabase[shortCode]);
            }

            const shortUrl = `${req.protocol}://${req.get('host')}/s/${shortCode}`;
            const createdAt = new Date().toISOString();
            
            let expiresAt = null;
            if (expiresIn) {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + parseInt(expiresIn));
                expiresAt = expiryDate.toISOString();
            }

            // Store in database
            urlDatabase[shortCode] = {
                originalUrl: url,
                shortUrl: shortUrl,
                shortCode: shortCode,
                createdAt: createdAt,
                expiresAt: expiresAt,
                clicks: 0
            };

            // Initialize stats
            urlStats[shortCode] = {
                clicks: 0,
                lastAccessed: null,
                referrers: {},
                countries: {},
                devices: {},
                browsers: {}
            };

            res.json({
                status: 'success',
                message: 'URL shortened successfully',
                data: {
                    originalUrl: url,
                    shortUrl: shortUrl,
                    shortCode: shortCode,
                    createdAt: createdAt,
                    expiresAt: expiresAt,
                    clicks: 0
                }
            });
        } catch (error) {
            console.error('URL shortener error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to shorten URL',
                error: error.message
            });
        }
    });

    // Get URL info
    app.get('/api/urlshortener/info/:shortCode', (req, res) => {
        try {
            const { shortCode } = req.params;
            
            if (!urlDatabase[shortCode]) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Short URL not found'
                });
            }

            const urlInfo = urlDatabase[shortCode];
            const stats = urlStats[shortCode];

            // Check if URL has expired
            if (urlInfo.expiresAt && new Date(urlInfo.expiresAt) < new Date()) {
                return res.status(410).json({
                    status: 'error',
                    message: 'Short URL has expired'
                });
            }

            res.json({
                status: 'success',
                message: 'URL info retrieved successfully',
                data: {
                    ...urlInfo,
                    stats: stats
                }
            });
        } catch (error) {
            console.error('URL info error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve URL info',
                error: error.message
            });
        }
    });

    // Get all URLs (for management)
    app.get('/api/urlshortener/list', (req, res) => {
        try {
            const urls = Object.keys(urlDatabase).map(shortCode => ({
                shortCode: shortCode,
                shortUrl: urlDatabase[shortCode].shortUrl,
                originalUrl: urlDatabase[shortCode].originalUrl,
                createdAt: urlDatabase[shortCode].createdAt,
                expiresAt: urlDatabase[shortCode].expiresAt,
                clicks: urlDatabase[shortCode].clicks,
                isActive: !urlDatabase[shortCode].expiresAt || new Date(urlDatabase[shortCode].expiresAt) > new Date()
            }));

            res.json({
                status: 'success',
                message: 'URL list retrieved successfully',
                data: {
                    totalUrls: urls.length,
                    urls: urls
                }
            });
        } catch (error) {
            console.error('URL list error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve URL list',
                error: error.message
            });
        }
    });

    // Delete short URL
    app.delete('/api/urlshortener/:shortCode', (req, res) => {
        try {
            const { shortCode } = req.params;
            
            if (!urlDatabase[shortCode]) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Short URL not found'
                });
            }

            const originalUrl = urlDatabase[shortCode].originalUrl;
            delete urlDatabase[shortCode];
            delete urlStats[shortCode];

            res.json({
                status: 'success',
                message: 'Short URL deleted successfully',
                data: {
                    shortCode: shortCode,
                    originalUrl: originalUrl
                }
            });
        } catch (error) {
            console.error('URL delete error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to delete short URL',
                error: error.message
            });
        }
    });
};

function generateShortCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}