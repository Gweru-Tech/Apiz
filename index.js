const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.enable("trust proxy");
app.set("json spaces", 2);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Load settings with error handling
let settings = {};
try {
    const settingsPath = path.join(__dirname, './src/settings.json');
    if (fs.existsSync(settingsPath)) {
        settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } else {
        console.log(chalk.yellow('Warning: settings.json not found, using defaults'));
        settings = {
            maintenance: { enabled: false },
            apiSettings: { creator: "Hookrest API" }
        };
    }
} catch (error) {
    console.log(chalk.red('Error loading settings, using defaults:', error.message));
    settings = {
        maintenance: { enabled: false },
        apiSettings: { creator: "Hookrest API" }
    };
}

// Maintenance Middleware - Place BEFORE static files
app.use((req, res, next) => {
    if (settings.maintenance && settings.maintenance.enabled) {
        console.log(chalk.bgRed.white(' MAINTENANCE MODE ACTIVE '));
        return res.status(503).sendFile(path.join(__dirname, 'api-page', 'maintenance.html'));
    }
    next();
});

// Static files
app.use('/', express.static(path.join(__dirname, 'api-page')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Response formatter
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        if (data && typeof data === 'object') {
            const responseData = {
                status: data.status || 'success',
                creator: settings.apiSettings?.creator || "Hookrest API",
                timestamp: new Date().toISOString(),
                ...data
            };
            return originalJson.call(this, responseData);
        }
        return originalJson.call(this, data);
    };
    next();
});

// FIXED API Route Loader
let totalRoutes = 0;
const apiFolder = path.join(__dirname, './src/api');

try {
    if (fs.existsSync(apiFolder)) {
        const files = fs.readdirSync(apiFolder);
        
        files.forEach((file) => {
            const filePath = path.join(apiFolder, file);
            const stat = fs.statSync(filePath);
            
            // Handle subdirectories
            if (stat.isDirectory()) {
                const subFiles = fs.readdirSync(filePath);
                subFiles.forEach((subFile) => {
                    if (path.extname(subFile) === '.js') {
                        try {
                            require(path.join(filePath, subFile))(app);
                            totalRoutes++;
                            console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${file}/${subFile} `));
                        } catch (error) {
                            console.error(chalk.red(`Error loading route ${file}/${subFile}:`, error.message));
                        }
                    }
                });
            } 
            // Handle direct .js files in api folder
            else if (path.extname(file) === '.js') {
                try {
                    require(filePath)(app);
                    totalRoutes++;
                    console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${file} `));
                } catch (error) {
                    console.error(chalk.red(`Error loading route ${file}:`, error.message));
                }
            }
        });
    } else {
        console.log(chalk.yellow('API folder not found, creating it...'));
        fs.mkdirSync(apiFolder, { recursive: true });
    }
} catch (error) {
    console.error(chalk.red('Error loading API routes:', error.message));
}

console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Load Complete! ✓ '));
console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Total Routes Loaded: ${totalRoutes} `));

// URL shortener redirect handler
app.get('/s/:shortCode', (req, res) => {
    try {
        const { shortCode } = req.params;
        
        // Try to load URL shortener module if available
        const urlDatabase = {};
        
        if (urlDatabase[shortCode]) {
            const urlInfo = urlDatabase[shortCode];
            
            // Check if URL has expired
            if (urlInfo.expiresAt && new Date(urlInfo.expiresAt) < new Date()) {
                return res.status(410).sendFile(path.join(__dirname, 'api-page', '410.html'));
            }
            
            // Increment click count (in a real app, this would be persistent)
            urlInfo.clicks = (urlInfo.clicks || 0) + 1;
            
            // Redirect to original URL
            res.redirect(urlInfo.originalUrl);
        } else {
            res.status(404).sendFile(path.join(__dirname, 'api-page', '404.html'));
        }
    } catch (error) {
        console.error('URL redirect error:', error);
        res.status(500).sendFile(path.join(__dirname, 'api-page', '500.html'));
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        routes: totalRoutes,
        maintenance: settings.maintenance?.enabled || false,
        timestamp: new Date().toISOString()
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'api-page', 'index.html'));
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        status: 'success',
        message: 'Hookrest API Documentation',
        version: '1.0.0',
        endpoints: getAvailableEndpoints(),
        creator: settings.apiSettings?.creator || "Hookrest API"
    });
});

// Error handlers
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'api-page', '404.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, 'api-page', '500.html'));
});

function getAvailableEndpoints() {
    const endpoints = [];
    try {
        if (fs.existsSync(apiFolder)) {
            fs.readdirSync(apiFolder).forEach((file) => {
                if (path.extname(file) === '.js') {
                    endpoints.push(`/api/${path.basename(file, '.js')}`);
                }
            });
        }
    } catch (error) {
        console.error('Error reading endpoints:', error.message);
    }
    return endpoints;
}

app.listen(PORT, () => {
    console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Server is running on port ${PORT} `));
    console.log(chalk.cyan(` Health check: http://localhost:${PORT}/health `));
    console.log(chalk.cyan(` API docs: http://localhost:${PORT}/api/docs `));
    
    // Log maintenance status on startup
    if (settings.maintenance && settings.maintenance.enabled) {
        console.log(chalk.bgRed.white(' MAINTENANCE MODE ENABLED '));
        console.log(chalk.yellow(` Maintenance GIF: ${settings.maintenance.gifUrl} `));
    }
});

module.exports = app;
