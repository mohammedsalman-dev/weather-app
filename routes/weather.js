// routes/weather.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const axios = require('axios');

// Utility: Get API key from DB by service name
async function getApiKey(service) {
  const [rows] = await db.query('SELECT key_value FROM api_keys WHERE service = ?', [service]);
  return rows.length ? rows[0].key_value : null;
}

router.get('/', (req, res) => {
  res.render('index');
});


// POST /api/weather
router.post('/api/weather', async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required.' });
  }

  try {
    // 1. Get Mapbox API key
    const mapboxKey = await getApiKey('mapbox');
    if (!mapboxKey) throw new Error('Mapbox API key not found.');

    // 2. Geocode address to lat/lon
    const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxKey}&limit=1`;
    const geoRes = await axios.get(geoUrl);
    const geoData = geoRes.data;

    if (!geoData.features || geoData.features.length === 0) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    const [lon, lat] = geoData.features[0].center;

    // 3. Get OpenWeather API key
    const weatherKey = await getApiKey('openweathermap');
    if (!weatherKey) throw new Error('OpenWeather API key not found.');

    // 4. Call OpenWeather OneCall API
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?appid=${weatherKey}&exclude=daily,minutely&units=metric&lat=${lat}&lon=${lon}`;
    const weatherRes = await axios.get(weatherUrl);
    const weatherData = weatherRes.data;

    // 5. Extract useful fields
    const result = {
      location: geoData.features[0].place_name,
      lat,
      lon,
      current: weatherData.current,
      hourly: weatherData.hourly.slice(0, 6) // Optional: limit hourly data
    };

    res.json(result);

  } catch (error) {
    console.error('Weather API error:', error.message);
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
    const result = await db.query(
      `INSERT INTO weather_history (address, latitude, longitude, weather_data)
       VALUES (?, ?, ?, ?)`,
      [address, lat, lon, JSON.stringify(weatherData)]
    );

    res.json({ message: 'Weather data saved successfully.' });

  } catch (error) {
    console.error('❌ Failed to save weather:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/api/history', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, address, latitude, longitude, weather_data, created_at 
       FROM weather_history 
       ORDER BY created_at DESC`
    );

    res.json(rows); 
  } catch (error) {
    console.error('❌ Failed to fetch history:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM weather_history');
    res.json(rows);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
