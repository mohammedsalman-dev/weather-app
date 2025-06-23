const express = require('express');
const router = express.Router();
const { getCoordinates, getWeather } = require('../services/weatherService');
const { saveWeather, getWeatherHistory } = require('../services/weatherDbService');

// GET /
router.get('/', (req, res) => {
  res.render('index');
});

// POST /api/weather
router.post('/api/weather', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Address is required.' });

  try {
    const { lat, lon, location } = await getCoordinates(address);
    const weatherData = await getWeather(lat, lon);

    res.json({
      location,
      lat,
      lon,
      current: weatherData.current,
      hourly: weatherData.hourly.slice(0, 6)
    });
  } catch (error) {
    console.error('❌ Weather error:', error.message);
    res.status(500).json({ error: 'Failed to get weather data.' });
  }
});

// POST /api/save-weather
router.post('/api/save-weather', async (req, res) => {
  const { address, lat, lon, weatherData } = req.body;
  if (!address || !lat || !lon || !weatherData) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    await saveWeather({ address, lat, lon, weatherData });
    res.json({ message: '✅ Weather data saved successfully.' });
  } catch (error) {
    console.error('❌ Save error:', error.message);
    res.status(500).json({ error: 'Failed to save weather.' });
  }
});

// GET /api/history
router.get('/api/history', async (req, res) => {
  try {
    const data = await getWeatherHistory();
    res.json(data);
  } catch (error) {
    console.error('❌ History error:', error.message);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

module.exports = router;
