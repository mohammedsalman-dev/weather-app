// scripts/upsertApiKey.js
import db from '../db/connection.js';
import dotenv from 'dotenv';
dotenv.config();

const { MAPBOX_API_KEY, OPENWEATHER_API_KEY } = process.env;
const apiKeysToUpsert = [
  { service: 'mapbox', key_value: MAPBOX_API_KEY },
  { service: 'openweathermap', key_value: OPENWEATHER_API_KEY }
];

async function upsertApiKeys() {
  try {
    for (const { service, key_value } of apiKeysToUpsert) {
      const [rows] = await db.query('SELECT * FROM api_keys WHERE service = ?', [service]);

      if (rows.length === 0) {
        await db.query('INSERT INTO api_keys (service, key_value) VALUES (?, ?)', [
          service,
          key_value
        ]);
        console.log(`✅ Inserted new API key for '${service}'`);
      } else {
        await db.query('UPDATE api_keys SET key_value = ? WHERE service = ?', [key_value, service]);
        console.log(`♻️  Updated API key for '${service}'`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Upsert failed:', err.message);
    process.exit(1);
  }
}

upsertApiKeys();
