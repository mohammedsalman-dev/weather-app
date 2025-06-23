// routes/weather.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/', (req, res) => {
});

router.post('/weather', (req, res) => {
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
