const axios = require('axios');

module.exports = (app) => {
    // Get current weather (demo with mock data)
    app.get('/api/weather/current', async (req, res) => {
        try {
            const { city, country } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            // In a real implementation, you would use a weather API like OpenWeatherMap
            // For demo purposes, we'll return mock data
            const mockWeatherData = {
                city: city,
                country: country || 'Unknown',
                temperature: Math.floor(Math.random() * 30) + 10,
                feelsLike: Math.floor(Math.random() * 30) + 10,
                humidity: Math.floor(Math.random() * 60) + 40,
                pressure: Math.floor(Math.random() * 50) + 1000,
                windSpeed: Math.floor(Math.random() * 20) + 5,
                windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
                visibility: Math.floor(Math.random() * 10) + 5,
                uvIndex: Math.floor(Math.random() * 11),
                condition: ['Clear', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Stormy', 'Foggy'][Math.floor(Math.random() * 6)],
                icon: '☀️',
                sunrise: '06:30',
                sunset: '18:45',
                lastUpdated: new Date().toISOString()
            };

            res.json({
                status: 'success',
                message: 'Weather data retrieved successfully',
                data: mockWeatherData,
                note: 'This is demo data. In production, connect to a real weather API.'
            });
        } catch (error) {
            console.error('Weather API error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve weather data',
                error: error.message
            });
        }
    });

    // Get weather forecast (demo)
    app.get('/api/weather/forecast', async (req, res) => {
        try {
            const { city, days = 5 } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            const forecastDays = Math.min(parseInt(days), 7); // Max 7 days
            const forecast = [];

            const conditions = ['Clear', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Stormy'];
            const icons = ['☀️', '☁️', '⛅', '🌧️', '⛈️'];

            for (let i = 0; i < forecastDays; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                
                const condition = conditions[Math.floor(Math.random() * conditions.length)];
                const icon = icons[conditions.indexOf(condition)];
                
                forecast.push({
                    date: date.toISOString().split('T')[0],
                    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
                    condition: condition,
                    icon: icon,
                    maxTemp: Math.floor(Math.random() * 15) + 20,
                    minTemp: Math.floor(Math.random() * 10) + 10,
                    humidity: Math.floor(Math.random() * 40) + 40,
                    windSpeed: Math.floor(Math.random() * 15) + 5,
                    precipitationChance: Math.floor(Math.random() * 100)
                });
            }

            res.json({
                status: 'success',
                message: 'Weather forecast retrieved successfully',
                data: {
                    city: city,
                    forecast: forecast
                },
                note: 'This is demo data. In production, connect to a real weather API.'
            });
        } catch (error) {
            console.error('Weather forecast error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve weather forecast',
                error: error.message
            });
        }
    });

    // Get weather by coordinates
    app.get('/api/weather/coordinates', async (req, res) => {
        try {
            const { lat, lon } = req.query;
            
            if (!lat || !lon) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Latitude and longitude parameters are required'
                });
            }

            const latitude = parseFloat(lat);
            const longitude = parseFloat(lon);

            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid coordinates'
                });
            }

            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Coordinates out of range'
                });
            }

            // Mock location data based on coordinates
            const locationData = {
                coordinates: {
                    latitude: latitude,
                    longitude: longitude
                },
                estimatedLocation: getMockLocation(latitude, longitude),
                weather: {
                    temperature: Math.floor(Math.random() * 30) + 10,
                    feelsLike: Math.floor(Math.random() * 30) + 10,
                    humidity: Math.floor(Math.random() * 60) + 40,
                    pressure: Math.floor(Math.random() * 50) + 1000,
                    windSpeed: Math.floor(Math.random() * 20) + 5,
                    condition: ['Clear', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
                    icon: ['☀️', '☁️', '⛅', '🌧️'][Math.floor(Math.random() * 4)],
                    lastUpdated: new Date().toISOString()
                }
            };

            res.json({
                status: 'success',
                message: 'Weather data by coordinates retrieved successfully',
                data: locationData,
                note: 'This is demo data. In production, connect to a real weather API.'
            });
        } catch (error) {
            console.error('Weather coordinates error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve weather by coordinates',
                error: error.message
            });
        }
    });
};

function getMockLocation(lat, lon) {
    // Simple mock location based on rough coordinates
    if (lat > 40 && lat < 50 && lon > -80 && lon < -70) {
        return 'New York, USA';
    } else if (lat > 50 && lat < 55 && lon > -5 && lon < 5) {
        return 'London, UK';
    } else if (lat > 35 && lat < 40 && lon > 135 && lon < 145) {
        return 'Tokyo, Japan';
    } else {
        return `Location at ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    }
}