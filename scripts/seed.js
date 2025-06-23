// scripts/seed.js (use ESM if your project uses import/export)
import db from '../db/connection.js';

const apiKeys = [
  { service: 'mapbox', key_value: 'YOUR_MAPBOX_KEY' },
  { service: 'openweathermap', key_value: 'YOUR_OPENWEATHER_KEY' }
];

async function seedApiKeys() {
  try {
    for (const { service, key_value } of apiKeys) {
      const [rows] = await db.query('SELECT 1 FROM api_keys WHERE service = ?', [service]);

      if (rows.length === 0) {
        await db.query('INSERT INTO api_keys (service, key_value) VALUES (?, ?)', [
          service,
          key_value
        ]);
        console.log(`✅ Inserted API key for '${service}'`);
      } else {
        console.log(`ℹ️ API key for '${service}' already exists`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed API keys:', error.message);
    process.exit(1);
  }
}

seedApiKeys();
