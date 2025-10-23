const axios = require('axios');
const { handleError, validateRequiredParams } = require('../utils/helper');

exports.getCurrentWeather = async (req, res) => {
  try {
    const { city, country } = req.query;
    
    const validation = validateRequiredParams({ city }, ['city']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const location = country ? `$${city},$$ {country}` : city;
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: location,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    res.json({
      success: true,
      data: {
        city: response.data.name,
        country: response.data.sys.country,
        temperature: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        wind_speed: response.data.wind.speed
      }
    });
  } catch (error) {
    handleError(res, error, 'Weather fetch failed');
  }
};

exports.getForecast = async (req, res) => {
  try {
    const { city, country, days = 5 } = req.query;
    
    const validation = validateRequiredParams({ city }, ['city']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const location = country ? `$${city},$$ {country}` : city;
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: location,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
        cnt: days * 8 // 8 forecasts per day (3-hour intervals)
      }
    });

    const forecast = response.data.list.map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed
    }));

    res.json({
      success: true,
      data: {
        city: response.data.city.name,
        country: response.data.city.country,
        forecast
      }
    });
  } catch (error) {
    handleError(res, error, 'Forecast fetch failed');
  }
};
