const axios = require('axios');

module.exports = (app) => {
    // Enhanced weather database with more realistic data
    const weatherLocations = {
        'london': {
            city: 'London',
            country: 'United Kingdom',
            coordinates: { lat: 51.5074, lon: -0.1278 },
            timezone: 'GMT',
            current: {
                temperature: 12,
                feelsLike: 10,
                humidity: 78,
                pressure: 1012,
                windSpeed: 15,
                windDirection: 'SW',
                visibility: 10,
                uvIndex: 2,
                condition: 'Partly Cloudy',
                icon: '⛅',
                sunrise: '07:45',
                sunset: '16:15',
                dewPoint: 8,
                cloudCover: 65,
                precipitationProbability: 30
            },
            forecast: [],
            alerts: []
        },
        'new york': {
            city: 'New York',
            country: 'United States',
            coordinates: { lat: 40.7128, lon: -74.0060 },
            timezone: 'EST',
            current: {
                temperature: 8,
                feelsLike: 5,
                humidity: 65,
                pressure: 1015,
                windSpeed: 20,
                windDirection: 'NW',
                visibility: 10,
                uvIndex: 3,
                condition: 'Clear',
                icon: '☀️',
                sunrise: '06:55',
                sunset: '16:30',
                dewPoint: 2,
                cloudCover: 10,
                precipitationProbability: 10
            },
            forecast: [],
            alerts: []
        },
        'tokyo': {
            city: 'Tokyo',
            country: 'Japan',
            coordinates: { lat: 35.6762, lon: 139.6503 },
            timezone: 'JST',
            current: {
                temperature: 15,
                feelsLike: 14,
                humidity: 70,
                pressure: 1018,
                windSpeed: 10,
                windDirection: 'E',
                visibility: 10,
                uvIndex: 4,
                condition: 'Clear',
                icon: '☀️',
                sunrise: '06:20',
                sunset: '16:45',
                dewPoint: 10,
                cloudCover: 20,
                precipitationProbability: 15
            },
            forecast: [],
            alerts: []
        },
        'harare': {
            city: 'Harare',
            country: 'Zimbabwe',
            coordinates: { lat: -17.8292, lon: 31.0539 },
            timezone: 'CAT',
            current: {
                temperature: 28,
                feelsLike: 29,
                humidity: 45,
                pressure: 1010,
                windSpeed: 12,
                windDirection: 'NE',
                visibility: 10,
                uvIndex: 9,
                condition: 'Sunny',
                icon: '☀️',
                sunrise: '05:30',
                sunset: '18:15',
                dewPoint: 15,
                cloudCover: 15,
                precipitationProbability: 5
            },
            forecast: [],
            alerts: []
        }
    };

    // Get current weather (enhanced)
    app.get('/api/weather-enhanced/current', async (req, res) => {
        try {
            const { city, country, units = 'metric', lang = 'en' } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            const locationKey = city.toLowerCase();
            const locationData = weatherLocations[locationKey] || generateMockWeatherData(city, country);

            // Convert units if needed
            let convertedData = convertUnits(locationData.current, units);

            // Add air quality data
            convertedData.airQuality = generateAirQualityData(locationKey);
            
            // Add sun/moon data
            convertedData.celestial = generateCelestialData(locationKey);
            
            // Add real-feel calculations
            convertedData.apparentTemperature = calculateApparentTemperature(convertedData);

            res.json({
                status: 'success',
                message: 'Enhanced weather data retrieved successfully',
                data: {
                    location: {
                        city: locationData.city,
                        country: locationData.country,
                        coordinates: locationData.coordinates,
                        timezone: locationData.timezone
                    },
                    current: convertedData,
                    units: units,
                    language: lang,
                    lastUpdated: new Date().toISOString(),
                    dataProvider: 'MockWeather Enhanced API',
                    note: 'This is enhanced demo data with additional metrics'
                }
            });
        } catch (error) {
            console.error('Enhanced weather error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve weather data',
                error: error.message
            });
        }
    });

    // Get detailed weather forecast
    app.get('/api/weather-enhanced/forecast', async (req, res) => {
        try {
            const { city, days = 7, units = 'metric', includeHourly = false } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            const locationKey = city.toLowerCase();
            const locationData = weatherLocations[locationKey] || generateMockWeatherData(city);

            // Generate forecast
            const forecast = generateDetailedForecast(parseInt(days), locationKey, units);
            
            // Add hourly forecast if requested
            if (includeHourly === 'true') {
                forecast.hourly = generateHourlyForecast(24, locationKey, units);
            }

            res.json({
                status: 'success',
                message: `Weather forecast retrieved for ${days} days`,
                data: {
                    location: {
                        city: locationData.city,
                        country: locationData.country,
                        coordinates: locationData.coordinates
                    },
                    forecast: forecast,
                    units: units,
                    generatedAt: new Date().toISOString()
                }
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

    // Get weather alerts
    app.get('/api/weather-enhanced/alerts', async (req, res) => {
        try {
            const { city, severity = 'all' } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            const alerts = generateWeatherAlerts(city, severity);

            res.json({
                status: 'success',
                message: `Found ${alerts.length} weather alerts`,
                data: {
                    city: city,
                    alerts: alerts,
                    severityFilter: severity,
                    totalActive: alerts.filter(a => a.active).length
                }
            });
        } catch (error) {
            console.error('Weather alerts error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve weather alerts',
                error: error.message
            });
        }
    });

    // Get historical weather data
    app.get('/api/weather-enhanced/historical', async (req, res) => {
        try {
            const { city, date, days = 7, aggregation = 'daily' } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            const historicalData = generateHistoricalWeather(city, parseInt(days), aggregation);

            res.json({
                status: 'success',
                message: `Historical weather data for ${city}`,
                data: {
                    city: city,
                    period: `${days} days`,
                    aggregation: aggregation,
                    data: historicalData,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Historical weather error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve historical data',
                error: error.message
            });
        }
    });

    // Get weather map data
    app.get('/api/weather-enhanced/map', async (req, res) => {
        try {
            const { layer = 'temperature', zoom = 'world', bounds } = req.query;
            
            const mapData = generateWeatherMapData(layer, zoom, bounds);

            res.json({
                status: 'success',
                message: 'Weather map data generated',
                data: {
                    layer: layer,
                    zoom: zoom,
                    bounds: bounds,
                    data: mapData,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Weather map error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to generate weather map',
                error: error.message
            });
        }
    });

    // Get climate data
    app.get('/api/weather-enhanced/climate', async (req, res) => {
        try {
            const { city, month } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            const climateData = generateClimateData(city, month);

            res.json({
                status: 'success',
                message: `Climate data for ${city}`,
                data: climateData
            });
        } catch (error) {
            console.error('Climate data error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve climate data',
                error: error.message
            });
        }
    });

    // Get air quality data
    app.get('/api/weather-enhanced/air-quality', async (req, res) => {
        try {
            const { city, pollutants = 'all' } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            const airQualityData = generateDetailedAirQuality(city, pollutants);

            res.json({
                status: 'success',
                message: 'Air quality data retrieved',
                data: airQualityData
            });
        } catch (error) {
            console.error('Air quality error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve air quality data',
                error: error.message
            });
        }
    });

    // Get sunrise/sunset data
    app.get('/api/weather-enhanced/sun', async (req, res) => {
        try {
            const { city, date = 'today' } = req.query;
            
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City parameter is required'
                });
            }

            const sunData = generateSunData(city, date);

            res.json({
                status: 'success',
                message: 'Sun data retrieved',
                data: sunData
            });
        } catch (error) {
            console.error('Sun data error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve sun data',
                error: error.message
            });
        }
    });
};

// Helper functions
function generateMockWeatherData(city, country) {
    const baseTemp = Math.floor(Math.random() * 25) + 5;
    return {
        city: city,
        country: country || 'Unknown',
        coordinates: { lat: Math.random() * 180 - 90, lon: Math.random() * 360 - 180 },
        timezone: 'UTC',
        current: {
            temperature: baseTemp,
            feelsLike: baseTemp + Math.floor(Math.random() * 5) - 2,
            humidity: Math.floor(Math.random() * 40) + 40,
            pressure: Math.floor(Math.random() * 50) + 1000,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            visibility: Math.floor(Math.random() * 5) + 5,
            uvIndex: Math.floor(Math.random() * 11),
            condition: ['Clear', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 5)],
            icon: ['☀️', '☁️', '⛅', '🌧️', '⛈️'][Math.floor(Math.random() * 5)],
            sunrise: '06:30',
            sunset: '18:30',
            dewPoint: baseTemp - 5,
            cloudCover: Math.floor(Math.random() * 100),
            precipitationProbability: Math.floor(Math.random() * 100)
        }
    };
}

function convertUnits(weatherData, units) {
    const converted = { ...weatherData };
    
    if (units === 'imperial') {
        converted.temperature = Math.round(weatherData.temperature * 9/5 + 32);
        converted.feelsLike = Math.round(weatherData.feelsLike * 9/5 + 32);
        converted.windSpeed = Math.round(weatherData.windSpeed * 2.237);
        converted.visibility = Math.round(weatherData.visibility * 0.621371);
        converted.pressure = Math.round(weatherData.pressure * 0.02953);
        converted.dewPoint = Math.round(weatherData.dewPoint * 9/5 + 32);
    }
    
    return converted;
}

function generateAirQualityData(location) {
    return {
        aqi: Math.floor(Math.random() * 150) + 20,
        pm25: Math.floor(Math.random() * 50) + 5,
        pm10: Math.floor(Math.random() * 80) + 10,
        o3: Math.floor(Math.random() * 100) + 10,
        no2: Math.floor(Math.random() * 40) + 5,
        so2: Math.floor(Math.random() * 20) + 2,
        co: Math.floor(Math.random() * 10) + 1,
        level: getAQILevel(Math.floor(Math.random() * 150) + 20),
        healthEffects: getHealthEffects(Math.floor(Math.random() * 150) + 20)
    };
}

function getAQILevel(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}

function getHealthEffects(aqi) {
    if (aqi <= 50) return 'Air quality is satisfactory';
    if (aqi <= 100) return 'Acceptable for most people';
    if (aqi <= 150) return 'Sensitive individuals may experience minor issues';
    if (aqi <= 200) return 'Everyone may begin to experience health effects';
    if (aqi <= 300) return 'Health warnings of emergency conditions';
    return 'Emergency conditions: entire population affected';
}

function generateCelestialData(location) {
    const now = new Date();
    const sunrise = new Date(now);
    sunrise.setHours(6, 30, 0, 0);
    const sunset = new Date(now);
    sunset.setHours(18, 30, 0, 0);
    
    return {
        sunrise: {
            time: '06:30',
            azimuth: 108,
            altitude: 0
        },
        sunset: {
            time: '18:30',
            azimuth: 252,
            altitude: 0
        },
        moon: {
            phase: getMoonPhase(now),
            illumination: Math.floor(Math.random() * 100),
            riseTime: '20:15',
            setTime: '08:45'
        }
    };
}

function getMoonPhase(date) {
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                   'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    return phases[Math.floor((date.getDate() / 30) * 8) % 8];
}

function calculateApparentTemperature(weatherData) {
    // Simplified apparent temperature calculation
    let apparent = weatherData.temperature;
    
    // Wind chill effect
    if (weatherData.temperature < 10 && weatherData.windSpeed > 5) {
        apparent -= weatherData.windSpeed * 0.2;
    }
    
    // Heat index effect
    if (weatherData.temperature > 25 && weatherData.humidity > 40) {
        apparent += (weatherData.humidity - 40) * 0.1;
    }
    
    return Math.round(apparent);
}

function generateDetailedForecast(days, location, units) {
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const baseTemp = Math.floor(Math.random() * 15) + 10;
        const dayForecast = {
            date: date.toISOString().split('T')[0],
            dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
            temperature: {
                min: baseTemp - 5,
                max: baseTemp + 8,
                morning: baseTemp - 2,
                afternoon: baseTemp + 5,
                evening: baseTemp + 1,
                night: baseTemp - 3
            },
            condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'][Math.floor(Math.random() * 5)],
            icon: ['☀️', '⛅', '☁️', '🌦️', '☀️'][Math.floor(Math.random() * 5)],
            humidity: Math.floor(Math.random() * 30) + 50,
            windSpeed: Math.floor(Math.random() * 15) + 5,
            windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            precipitationProbability: Math.floor(Math.random() * 100),
            precipitationAmount: Math.floor(Math.random() * 10) + 'mm',
            uvIndex: Math.floor(Math.random() * 11),
            sunrise: '06:' + String(20 + Math.floor(Math.random() * 30)).padStart(2, '0'),
            sunset: '18:' + String(15 + Math.floor(Math.random() * 30)).padStart(2, '0'),
            aqi: Math.floor(Math.random() * 100) + 20
        };
        
        forecast.push(dayForecast);
    }
    
    return { daily: forecast };
}

function generateHourlyForecast(hours, location, units) {
    const hourly = [];
    const now = new Date();
    
    for (let i = 0; i < hours; i++) {
        const date = new Date(now);
        date.setHours(now.getHours() + i);
        
        hourly.push({
            time: date.toISOString().split('T')[1].substring(0, 5),
            temperature: Math.floor(Math.random() * 15) + 10,
            condition: ['Clear', 'Cloudy', 'Partly Cloudy'][Math.floor(Math.random() * 3)],
            icon: ['☀️', '☁️', '⛅'][Math.floor(Math.random() * 3)],
            precipitationProbability: Math.floor(Math.random() * 100),
            windSpeed: Math.floor(Math.random() * 15) + 5,
            humidity: Math.floor(Math.random() * 30) + 50
        });
    }
    
    return hourly;
}

function generateWeatherAlerts(city, severity) {
    const allAlerts = [
        {
            id: 'alert_001',
            title: 'Heavy Rain Warning',
            description: 'Heavy rainfall expected. Potential for flooding in low-lying areas.',
            severity: 'Moderate',
            urgency: 'Expected',
            areas: [city, 'Surrounding areas'],
            category: 'Meteorological',
            certainty: 'Likely',
            event: 'Rain',
            note: 'Avoid driving through flooded areas.',
            effective: new Date().toISOString(),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            instruction: 'Monitor local weather updates and avoid unnecessary travel.'
        },
        {
            id: 'alert_002',
            title: 'High Temperature Advisory',
            description: 'Temperatures expected to be unusually high. Stay hydrated and avoid prolonged sun exposure.',
            severity: 'Minor',
            urgency: 'Expected',
            areas: [city],
            category: 'Temperature',
            certainty: 'Observed',
            event: 'Heat',
            note: 'Check on elderly neighbors and pets.',
            effective: new Date().toISOString(),
            expires: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            active: true,
            instruction: 'Drink plenty of water and limit outdoor activities.'
        }
    ];
    
    let alerts = allAlerts;
    
    if (severity !== 'all') {
        alerts = alerts.filter(alert => alert.severity.toLowerCase() === severity.toLowerCase());
    }
    
    return alerts;
}

function generateHistoricalWeather(city, days, aggregation) {
    const historical = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        if (aggregation === 'daily') {
            historical.push({
                date: date.toISOString().split('T')[0],
                temperatureMax: Math.floor(Math.random() * 15) + 15,
                temperatureMin: Math.floor(Math.random() * 10) + 5,
                temperatureAvg: Math.floor(Math.random() * 10) + 10,
                humidity: Math.floor(Math.random() * 30) + 50,
                precipitation: Math.floor(Math.random() * 20),
                windSpeed: Math.floor(Math.random() * 15) + 5,
                condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)]
            });
        }
    }
    
    return historical;
}

function generateWeatherMapData(layer, zoom, bounds) {
    const gridSize = 50;
    const mapData = [];
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            mapData.push({
                x: i,
                y: j,
                value: Math.floor(Math.random() * 100),
                lat: (Math.random() * 180 - 90).toFixed(4),
                lon: (Math.random() * 360 - 180).toFixed(4)
            });
        }
    }
    
    return {
        type: 'grid',
        resolution: gridSize,
        data: mapData,
        colorScale: getColorScale(layer),
        legend: {
            min: 0,
            max: 100,
            unit: getUnitForLayer(layer)
        }
    };
}

function getColorScale(layer) {
    const scales = {
        'temperature': ['#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000'],
        'precipitation': ['#FFFFFF', '#E0E0E0', '#808080', '#404040', '#000000'],
        'wind': ['#FFFFFF', '#87CEEB', '#4169E1', '#000080', '#000000'],
        'pressure': ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF']
    };
    return scales[layer] || scales.temperature;
}

function getUnitForLayer(layer) {
    const units = {
        'temperature': '°C',
        'precipitation': 'mm',
        'wind': 'km/h',
        'pressure': 'hPa'
    };
    return units[layer] || 'unit';
}

function generateClimateData(city, month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const climateData = {
        city: city,
        coordinates: { lat: Math.random() * 180 - 90, lon: Math.random() * 360 - 180 },
        monthlyAverages: months.map((monthName, index) => ({
            month: monthName,
            temperature: {
                avg: Math.floor(Math.random() * 20) + 10,
                min: Math.floor(Math.random() * 10) + 5,
                max: Math.floor(Math.random() * 15) + 20
            },
            precipitation: Math.floor(Math.random() * 100),
            humidity: Math.floor(Math.random() * 30) + 50,
            sunshineHours: Math.floor(Math.random() * 10) + 5,
            windSpeed: Math.floor(Math.random() * 15) + 5,
            daysWithRain: Math.floor(Math.random() * 15) + 5,
            daysAbove30C: Math.floor(Math.random() * 10),
            daysBelow0C: Math.floor(Math.random() * 5)
        })),
        yearlyAverages: {
            temperature: Math.floor(Math.random() * 15) + 10,
            precipitation: Math.floor(Math.random() * 1200) + 300,
            humidity: Math.floor(Math.random() * 20) + 60,
            sunshineHours: Math.floor(Math.random() * 2000) + 1500,
            windSpeed: Math.floor(Math.random() * 10) + 10,
            daysWithRain: Math.floor(Math.random() * 100) + 50,
            frostDays: Math.floor(Math.random() * 30) + 10,
            summerDays: Math.floor(Math.random() * 60) + 20
        },
        extremes: {
            highestTemperature: Math.floor(Math.random() * 20) + 35,
            lowestTemperature: Math.floor(Math.random() * 10) - 10,
            highestPrecipitation: Math.floor(Math.random() * 50) + 100,
            strongestWind: Math.floor(Math.random() * 50) + 50,
            longestDrySpell: Math.floor(Math.random() * 30) + 20,
            longestWetSpell: Math.floor(Math.random() * 15) + 10
        }
    };
    
    // If specific month requested, return that month's data
    if (month) {
        const monthIndex = months.findIndex(m => m.toLowerCase().includes(month.toLowerCase()));
        if (monthIndex !== -1) {
            return {
                ...climateData,
                currentMonth: climateData.monthlyAverages[monthIndex]
            };
        }
    }
    
    return climateData;
}

function generateDetailedAirQuality(city, pollutants) {
    const allPollutants = {
        pm25: { value: Math.floor(Math.random() * 50) + 5, unit: 'μg/m³', aqi: Math.floor(Math.random() * 100) + 20 },
        pm10: { value: Math.floor(Math.random() * 80) + 10, unit: 'μg/m³', aqi: Math.floor(Math.random() * 100) + 20 },
        o3: { value: Math.floor(Math.random() * 100) + 10, unit: 'μg/m³', aqi: Math.floor(Math.random() * 100) + 20 },
        no2: { value: Math.floor(Math.random() * 40) + 5, unit: 'μg/m³', aqi: Math.floor(Math.random() * 100) + 20 },
        so2: { value: Math.floor(Math.random() * 20) + 2, unit: 'μg/m³', aqi: Math.floor(Math.random() * 100) + 20 },
        co: { value: Math.floor(Math.random() * 10) + 1, unit: 'mg/m³', aqi: Math.floor(Math.random() * 100) + 20 }
    };
    
    const result = {
        location: city,
        overallAqi: Math.floor(Math.random() * 150) + 20,
        level: getAQILevel(Math.floor(Math.random() * 150) + 20),
        primaryPollutant: 'PM2.5',
        lastUpdated: new Date().toISOString(),
        forecast: generateAirQualityForecast(5)
    };
    
    if (pollutants === 'all') {
        result.pollutants = allPollutants;
    } else {
        const requestedPollutants = pollutants.split(',');
        result.pollutants = {};
        requestedPollutants.forEach(pollutant => {
            if (allPollutants[pollutant.trim()]) {
                result.pollutants[pollutant.trim()] = allPollutants[pollutant.trim()];
            }
        });
    }
    
    return result;
}

function generateAirQualityForecast(days) {
    const forecast = [];
    for (let i = 0; i < days; i++) {
        forecast.push({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            aqi: Math.floor(Math.random() * 150) + 20,
            level: getAQILevel(Math.floor(Math.random() * 150) + 20),
            pm25: Math.floor(Math.random() * 50) + 5,
            pm10: Math.floor(Math.random() * 80) + 10
        });
    }
    return forecast;
}

function generateSunData(city, date) {
    const baseSunrise = { hour: 6, minute: 30 };
    const baseSunset = { hour: 18, minute: 30 };
    
    // Adjust for seasons (simplified)
    const month = new Date().getMonth();
    const seasonalAdjustment = Math.sin((month / 12) * 2 * Math.PI) * 2; // ±2 hours
    
    const sunrise = {
        time: `${String(Math.floor(baseSunrise.hour + seasonalAdjustment)).padStart(2, '0')}:${String(baseSunrise.minute).padStart(2, '0')}`,
        azimuth: 108 + seasonalAdjustment * 10,
        altitude: 0,
        dawn: `${String(Math.floor(baseSunrise.hour + seasonalAdjustment - 0.5)).padStart(2, '0')}:00`,
        dusk: `${String(Math.floor(baseSunset.hour + seasonalAdjustment + 0.5)).padStart(2, '0')}:00`
    };
    
    const sunset = {
        time: `${String(Math.floor(baseSunset.hour + seasonalAdjustment)).padStart(2, '0')}:${String(baseSunset.minute).padStart(2, '0')}`,
        azimuth: 252 - seasonalAdjustment * 10,
        altitude: 0
    };
    
    const daylight = {
        duration: calculateDaylightDuration(sunrise.time, sunset.time),
        solarNoon: `${String(Math.floor((baseSunrise.hour + baseSunset.hour) / 2 + seasonalAdjustment)).padStart(2, '0')}:00`
    };
    
    return {
        location: city,
        date: date === 'today' ? new Date().toISOString().split('T')[0] : date,
        sunrise: sunrise,
        sunset: sunset,
        daylight: daylight,
        moon: generateCelestialData(city).moon
    };
}

function calculateDaylightDuration(sunrise, sunset) {
    const [riseHour, riseMin] = sunrise.split(':').map(Number);
    const [setHour, setMin] = sunset.split(':').map(Number);
    
    const riseMinutes = riseHour * 60 + riseMin;
    const setMinutes = setHour * 60 + setMin;
    const duration = setMinutes - riseMinutes;
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    return `${hours}h ${minutes}m`;
}