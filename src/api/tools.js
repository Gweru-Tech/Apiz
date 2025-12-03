module.exports = (app) => {
    // Text utilities endpoint
    app.post('/api/tools/text', (req, res) => {
        try {
            const { text, operations } = req.body;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Text parameter is required'
                });
            }

            const results = {};
            
            if (!operations || operations.length === 0) {
                // Perform all operations by default
                results.toUpperCase = text.toUpperCase();
                results.toLowerCase = text.toLowerCase();
                results.capitalize = text.replace(/\b\w/g, l => l.toUpperCase());
                results.reverse = text.split('').reverse().join('');
                results.wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
                results.charCount = text.length;
                results.charCountNoSpaces = text.replace(/\s/g, '').length;
                results.lineCount = text.split('\n').length;
            } else {
                operations.forEach(op => {
                    switch(op) {
                        case 'toUpperCase':
                            results.toUpperCase = text.toUpperCase();
                            break;
                        case 'toLowerCase':
                            results.toLowerCase = text.toLowerCase();
                            break;
                        case 'capitalize':
                            results.capitalize = text.replace(/\b\w/g, l => l.toUpperCase());
                            break;
                        case 'reverse':
                            results.reverse = text.split('').reverse().join('');
                            break;
                        case 'wordCount':
                            results.wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
                            break;
                        case 'charCount':
                            results.charCount = text.length;
                            break;
                        case 'charCountNoSpaces':
                            results.charCountNoSpaces = text.replace(/\s/g, '').length;
                            break;
                        case 'lineCount':
                            results.lineCount = text.split('\n').length;
                            break;
                        case 'removeSpaces':
                            results.removeSpaces = text.replace(/\s+/g, '');
                            break;
                        case 'removeExtraSpaces':
                            results.removeExtraSpaces = text.replace(/\s+/g, ' ').trim();
                            break;
                        case 'trim':
                            results.trim = text.trim();
                            break;
                        default:
                            results[op] = `Unknown operation: ${op}`;
                    }
                });
            }
            
            res.json({
                status: 'success',
                message: 'Text operations completed successfully',
                data: results
            });
        } catch (error) {
            console.error('Text tools error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to process text',
                error: error.message
            });
        }
    });

    // JSON utilities
    app.post('/api/tools/json', (req, res) => {
        try {
            const { json, operation } = req.body;
            
            if (!json) {
                return res.status(400).json({
                    status: 'error',
                    message: 'JSON parameter is required'
                });
            }

            let parsedJson;
            try {
                if (typeof json === 'string') {
                    parsedJson = JSON.parse(json);
                } else {
                    parsedJson = json;
                }
            } catch (parseError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid JSON format',
                    error: parseError.message
                });
            }

            let result;
            switch(operation) {
                case 'validate':
                    result = { isValid: true, message: 'JSON is valid' };
                    break;
                case 'beautify':
                    result = JSON.stringify(parsedJson, null, 2);
                    break;
                case 'minify':
                    result = JSON.stringify(parsedJson);
                    break;
                case 'keys':
                    result = getKeys(parsedJson);
                    break;
                case 'size':
                    result = {
                        charCount: JSON.stringify(parsedJson).length,
                        byteSize: Buffer.byteLength(JSON.stringify(parsedJson), 'utf8'),
                        properties: countProperties(parsedJson)
                    };
                    break;
                default:
                    result = { error: 'Unknown operation' };
            }
            
            res.json({
                status: 'success',
                message: 'JSON operation completed successfully',
                data: result
            });
        } catch (error) {
            console.error('JSON tools error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to process JSON',
                error: error.message
            });
        }
    });

    // URL utilities
    app.post('/api/tools/url', (req, res) => {
        try {
            const { url, operations } = req.body;
            
            if (!url) {
                return res.status(400).json({
                    status: 'error',
                    message: 'URL parameter is required'
                });
            }

            const results = {};
            
            if (!operations || operations.length === 0) {
                // Perform all operations by default
                results.isValid = isValidUrl(url);
                results.domain = extractDomain(url);
                results.protocol = extractProtocol(url);
                results.path = extractPath(url);
                results.query = extractQuery(url);
                results.hash = extractHash(url);
            } else {
                operations.forEach(op => {
                    switch(op) {
                        case 'isValid':
                            results.isValid = isValidUrl(url);
                            break;
                        case 'domain':
                            results.domain = extractDomain(url);
                            break;
                        case 'protocol':
                            results.protocol = extractProtocol(url);
                            break;
                        case 'path':
                            results.path = extractPath(url);
                            break;
                        case 'query':
                            results.query = extractQuery(url);
                            break;
                        case 'hash':
                            results.hash = extractHash(url);
                            break;
                        case 'encode':
                            results.encoded = encodeURIComponent(url);
                            break;
                        case 'decode':
                            results.decoded = decodeURIComponent(url);
                            break;
                        default:
                            results[op] = `Unknown operation: ${op}`;
                    }
                });
            }
            
            res.json({
                status: 'success',
                message: 'URL operations completed successfully',
                data: results
            });
        } catch (error) {
            console.error('URL tools error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to process URL',
                error: error.message
            });
        }
    });

    // Base64 encoder/decoder
    app.post('/api/tools/base64', (req, res) => {
        try {
            const { text, operation } = req.body;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Text parameter is required'
                });
            }

            let result;
            switch(operation) {
                case 'encode':
                    result = Buffer.from(text, 'utf8').toString('base64');
                    break;
                case 'decode':
                    try {
                        result = Buffer.from(text, 'base64').toString('utf8');
                    } catch (decodeError) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'Invalid Base64 string',
                            error: decodeError.message
                        });
                    }
                    break;
                default:
                    return res.status(400).json({
                        status: 'error',
                        message: 'Operation must be either "encode" or "decode"'
                    });
            }
            
            res.json({
                status: 'success',
                message: `Base64 ${operation} completed successfully`,
                data: {
                    operation: operation,
                    input: text,
                    result: result
                }
            });
        } catch (error) {
            console.error('Base64 tools error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to process Base64',
                error: error.message
            });
        }
    });
};

function getKeys(obj, prefix = '') {
    let keys = [];
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            keys.push(fullKey);
            
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                keys = keys.concat(getKeys(obj[key], fullKey));
            }
        }
    }
    
    return keys;
}

function countProperties(obj) {
    let count = 0;
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            count++;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                count += countProperties(obj[key]);
            }
        }
    }
    
    return count;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function extractDomain(url) {
    try {
        return new URL(url).hostname;
    } catch (_) {
        return 'Invalid URL';
    }
}

function extractProtocol(url) {
    try {
        return new URL(url).protocol;
    } catch (_) {
        return 'Invalid URL';
    }
}

function extractPath(url) {
    try {
        return new URL(url).pathname;
    } catch (_) {
        return 'Invalid URL';
    }
}

function extractQuery(url) {
    try {
        return new URL(url).search;
    } catch (_) {
        return 'Invalid URL';
    }
}

function extractHash(url) {
    try {
        return new URL(url).hash;
    } catch (_) {
        return 'Invalid URL';
    }
}