# Hookrest API

A powerful, fast, and reliable REST API service built with Express.js. This API provides various endpoints for common tasks including YouTube operations, QR code generation, text utilities, weather information, and URL shortening.

## 🚀 Features

- **YouTube API**: Search videos, get video info, and download options
- **QR Code Generator**: Create custom QR codes with various options
- **Text Utilities**: Text manipulation, JSON processing, URL tools, Base64 encoding/decoding
- **Weather API**: Current weather and forecast information
- **URL Shortener**: Create short URLs with custom aliases and analytics
- **Beautiful Documentation**: Interactive web interface with modern design
- **Maintenance Mode**: Built-in maintenance page with countdown timer
- **Error Handling**: Comprehensive error pages (404, 500, 410)
- **Health Checks**: Monitor server status and performance

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hookrest-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on port 4000 by default. You can change this by setting the `PORT` environment variable.

## 🔧 Environment Variables

- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment (development/production)

## 📚 API Endpoints

### General
- `GET /` - Main API documentation page
- `GET /health` - Server health check
- `GET /api/docs` - API documentation

### YouTube API
- `GET /api/youtube/search?query=<search_term>` - Search YouTube videos
- `GET /api/youtube/info?url=<video_url>` - Get video information
- `GET /api/youtube/download?url=<video_url>&format=<format>` - Get download options

### QR Code Generator
- `POST /api/qrcode/generate` - Generate QR code (JSON body: `{ text, size, errorCorrectionLevel }`)
- `POST /api/qrcode/custom` - Generate custom QR code with colors
- `GET /api/qrcode/generate?text=<text>&size=<size>` - Quick QR code generation
- `POST /api/qrcode/validate` - Validate text for QR code generation

### Text Utilities
- `POST /api/tools/text` - Text manipulation operations
- `POST /api/tools/json` - JSON validation, beautify, minify, and analysis
- `POST /api/tools/url` - URL parsing and manipulation
- `POST /api/tools/base64` - Base64 encode/decode operations

### Weather API
- `GET /api/weather/current?city=<city>&country=<country>` - Get current weather
- `GET /api/weather/forecast?city=<city>&days=<days>` - Get weather forecast
- `GET /api/weather/coordinates?lat=<lat>&lon=<lon>` - Get weather by coordinates

### URL Shortener
- `POST /api/urlshortener/shorten` - Create short URL
- `GET /api/urlshortener/info/<shortCode>` - Get URL information and stats
- `GET /api/urlshortener/list` - List all short URLs
- `DELETE /api/urlshortener/<shortCode>` - Delete short URL
- `GET /s/<shortCode>` - Redirect to original URL

## 🎨 Frontend Features

- **Interactive Dashboard**: Beautiful, responsive web interface
- **Real-time Status**: Live server status indicators
- **Error Pages**: Custom 404, 500, 410, and maintenance pages
- **Mobile Responsive**: Works perfectly on all devices
- **Dark/Light Mode**: Automatic theme based on content

## 🛠️ Configuration

Edit `src/settings.json` to customize:

- Maintenance mode settings
- API creator information
- Rate limiting configuration
- Feature toggles

### Example Configuration:
```json
{
  "maintenance": {
    "enabled": false,
    "gifUrl": "https://example.com/maintenance.gif"
  },
  "apiSettings": {
    "creator": "Your API Name",
    "version": "1.0.0"
  },
  "features": {
    "enableDocs": true,
    "enableHealthCheck": true,
    "enableCORS": true
  }
}
```

## 🚀 Deployment

### Render.com
1. Connect your repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Set environment variable: `PORT=4000`
5. Deploy!

### Other Platforms
This API is compatible with:
- Heroku
- Vercel (with adjustments)
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Railway
- Any Node.js hosting service

## 📝 API Usage Examples

### Generate QR Code
```javascript
const response = await fetch('/api/qrcode/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        text: 'https://example.com',
        size: 300,
        errorCorrectionLevel: 'M'
    })
});
const data = await response.json();
```

### Search YouTube
```javascript
const response = await fetch('/api/youtube/search?query=nodejs tutorial');
const data = await response.json();
```

### Create Short URL
```javascript
const response = await fetch('/api/urlshortener/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        url: 'https://example.com/very-long-url',
        customAlias: 'mylink',
        expiresIn: 30
    })
});
const data = await response.json();
```

## 🔒 Security Features

- CORS enabled for cross-origin requests
- Input validation on all endpoints
- Rate limiting configuration available
- Error handling prevents information leakage
- Secure headers automatically set

## 📊 Monitoring

- Health check endpoint for monitoring services
- Request/response logging
- Error tracking and reporting
- Performance metrics available

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you need help or have questions:
- Check the API documentation at `/api/docs`
- Review the README file
- Open an issue on GitHub
- Contact support at support@hookrest-api.com

## 🔮 Future Features

- [ ] User authentication and API keys
- [ ] Rate limiting per user
- [ ] Database persistence
- [ ] Analytics dashboard
- [ ] WebSocket support for real-time updates
- [ ] More utility endpoints
- [ ] Email notifications
- [ ] Bulk operations

---

Built with ❤️ using Express.js and modern web technologies