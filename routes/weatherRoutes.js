import express from 'express';
import { getCoordinates, getWeather, saveWeather, getWeatherHistory } from '../services/index.js';
import { getWeatherSchema, saveWeatherSchema } from '../validators/index.js';
import { validate } from '../middlewares/index.js';

import logger from '../logger.js';

const router = express.Router();

// GET /
router.get('/', (req, res) => {
  res.render('index');
});

// POST /api/weather
router.post('/api/weather', validate(getWeatherSchema), async (req, res) => {
  const { address } = req.body;

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
    logger.error('❌ Weather error:', error.message);
    res.status(500).json({ error: 'Failed to get weather data.' });
  }
});

// POST /api/save-weather
router.post('/api/save-weather', validate(saveWeatherSchema), async (req, res) => {
  const { address, lat, lon, weatherData } = req.body;

  try {
    await saveWeather({ address, lat, lon, weatherData });
    res.json({ message: '✅ Weather data saved successfully.' });
  } catch (error) {
    logger.error('❌ Save error:', error.message);
    res.status(500).json({ error: 'Failed to save weather.' });
  }
});

// GET /api/history
router.get('/api/history', async (req, res) => {
  try {
    const data = await getWeatherHistory();
    res.json(data);
  } catch (error) {
    logger.error('❌ History error:', error.message);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

export default router;
