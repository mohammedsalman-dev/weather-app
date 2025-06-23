const db = require('../db/connection');

async function saveWeather({ address, lat, lon, weatherData }) {
  return db.query(
    `INSERT INTO weather_history (address, latitude, longitude, weather_data)
     VALUES (?, ?, ?, ?)`,
    [address, lat, lon, JSON.stringify(weatherData)]
  );
}

async function getWeatherHistory() {
  const [rows] = await db.query(
    `SELECT id, address, latitude, longitude, weather_data, created_at 
     FROM weather_history 
     ORDER BY created_at DESC`
  );
  return rows;
}

module.exports = { saveWeather, getWeatherHistory };
