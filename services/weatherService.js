import axios from 'axios';
import { getApiKey } from './apiKeyService.js';
const { OPENWEATHER_BASE_URL, MAPBOX_BASE_URL } = process.env;

export async function getCoordinates(address) {
  const mapboxKey = await getApiKey('mapbox');
  if (!mapboxKey) throw new Error('Mapbox API key not found.');
  const geoUrl = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxKey}&limit=1`;
  const geoRes = await axios.get(geoUrl);
  const features = geoRes.data.features;

  if (!features || features.length === 0) throw new Error('Address not found.');

  const [lon, lat] = features[0].center;
  return { lat, lon, location: features[0].place_name };
}

export async function getWeather(lat, lon) {
  const weatherKey = await getApiKey('openweathermap');
  if (!weatherKey) throw new Error('OpenWeather API key not found.');

  const url = `${OPENWEATHER_BASE_URL}/data/3.0/onecall?appid=${weatherKey}&exclude=daily,minutely&units=metric&lat=${lat}&lon=${lon}`;
  const weatherRes = await axios.get(url);
  return weatherRes.data;
}
