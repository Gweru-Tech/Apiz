const QRCode = require('qrcode');

module.exports = (app) => {
    // Generate QR Code
    app.post('/api/qrcode/generate', async (req, res) => {
        try {
            const { text, size = 200, errorCorrectionLevel = 'M' } = req.body;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Text parameter is required'
                });
            }

            // Validate size
            const qrSize = parseInt(size);
            if (isNaN(qrSize) || qrSize < 50 || qrSize > 1000) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Size must be between 50 and 1000 pixels'
                });
            }

            // Validate error correction level
            const validLevels = ['L', 'M', 'Q', 'H'];
            if (!validLevels.includes(errorCorrectionLevel)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Error correction level must be L, M, Q, or H'
                });
            }

            const options = {
                width: qrSize,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: errorCorrectionLevel
            };

            // Generate QR code as base64
            const qrCodeDataUrl = await QRCode.toDataURL(text, options);
            
            res.json({
                status: 'success',
                message: 'QR Code generated successfully',
                data: {
                    text: text,
                    qrCode: qrCodeDataUrl,
                    size: qrSize,
                    errorCorrectionLevel: errorCorrectionLevel,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('QR Code generation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to generate QR Code',
                error: error.message
            });
        }
    });

    // Generate QR Code with custom colors
    app.post('/api/qrcode/custom', async (req, res) => {
        try {
            const { 
                text, 
                size = 200, 
                darkColor = '#000000', 
                lightColor = '#FFFFFF',
                errorCorrectionLevel = 'M'
            } = req.body;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Text parameter is required'
                });
            }

            // Validate colors (basic hex color validation)
            const hexColorRegex = /^#[0-9A-F]{6}$/i;
            if (!hexColorRegex.test(darkColor) || !hexColorRegex.test(lightColor)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Colors must be valid hex colors (e.g., #000000)'
                });
            }

            const options = {
                width: parseInt(size),
                margin: 1,
                color: {
                    dark: darkColor,
                    light: lightColor
                },
                errorCorrectionLevel: errorCorrectionLevel
            };

            const qrCodeDataUrl = await QRCode.toDataURL(text, options);
            
            res.json({
                status: 'success',
                message: 'Custom QR Code generated successfully',
                data: {
                    text: text,
                    qrCode: qrCodeDataUrl,
                    size: parseInt(size),
                    darkColor: darkColor,
                    lightColor: lightColor,
                    errorCorrectionLevel: errorCorrectionLevel,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Custom QR Code generation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to generate custom QR Code',
                error: error.message
            });
        }
    });

    // Generate QR Code from URL (GET request for convenience)
    app.get('/api/qrcode/generate', async (req, res) => {
        try {
            const { text, size = 200 } = req.query;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Text parameter is required'
                });
            }

            const options = {
                width: parseInt(size),
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            };

            const qrCodeDataUrl = await QRCode.toDataURL(text, options);
            
            // Redirect to the QR code image
            res.redirect(qrCodeDataUrl);
        } catch (error) {
            console.error('QR Code generation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to generate QR Code',
                error: error.message
            });
        }
    });

    // QR Code info/validation
    app.post('/api/qrcode/validate', (req, res) => {
        try {
            const { text } = req.body;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Text parameter is required'
                });
            }

            // Basic validation
            const validation = {
                isValid: true,
                length: text.length,
                type: detectTextType(text),
                maxLength: 2953, // Maximum for QR codes
                isTooLong: text.length > 2953
            };

            res.json({
                status: 'success',
                message: 'Text validation completed',
                data: validation
            });
        } catch (error) {
            console.error('QR Code validation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to validate text',
                error: error.message
            });
        }
    });
};

function detectTextType(text) {
    if (text.startsWith('http://') || text.startsWith('https://')) {
        return 'URL';
    } else if (text.includes('@')) {
        return 'Email';
    } else if (/^\+?\d{10,15}$/.test(text)) {
        return 'Phone';
    } else if (text.startsWith('WIFI:')) {
        return 'WiFi';
    } else if (text.startsWith('tel:')) {
        return 'Telephone';
    } else if (text.startsWith('sms:')) {
        return 'SMS';
    } else {
        return 'Text';
    }
}