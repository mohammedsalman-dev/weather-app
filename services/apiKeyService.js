import db from '../db/connection.js';

export async function getApiKey(service) {
  const [rows] = await db.query('SELECT key_value FROM api_keys WHERE service = ?', [service]);
  return rows.length ? rows[0].key_value : null;
}
