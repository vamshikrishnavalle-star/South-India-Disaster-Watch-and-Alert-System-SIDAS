const axios = require('axios');
const { normalizeAlert } = require('../services/normalizer');

const CITIES = [
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9784, lng: 79.5941 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Wayanad (Kalpetta)', state: 'Kerala', lat: 11.6103, lng: 76.0827 }
];

async function ingestWeatherData() {
  const weatherRecords = [];
  const generatedAlerts = [];

  for (const city of CITIES) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m`;
      const res = await axios.get(url, { timeout: 8000 });
      const current = res.data.current;

      const temp = current.temperature_2m;
      const rainfall = current.precipitation || 0.0;
      const wind = current.wind_speed_10m;

      weatherRecords.push({
        city: city.name,
        state: city.state,
        temp_c: temp,
        feels_like_c: current.apparent_temperature,
        rainfall_mm: rainfall,
        wind_kmph: wind,
        humidity: current.relative_humidity_2m,
        weather_condition: rainfall > 5 ? 'Rainy' : (temp > 38 ? 'Hot' : 'Clear'),
        fetched_at: new Date().toISOString()
      });

      if (rainfall >= 100) {
        generatedAlerts.push(normalizeAlert({
          source: 'Open-Meteo Rules', external_id: `rule-rain-red-${city.name}-${Date.now()}`,
          state: city.state, district: city.name, hazard: 'Flood', severity: 'Red',
          headline: `Extremely Heavy Rain in ${city.name} (${rainfall} mm)`, templateKey: 'HEAVY_RAIN_RED',
          lat: city.lat, lng: city.lng
        }));
      } else if (rainfall >= 50) {
        generatedAlerts.push(normalizeAlert({
          source: 'Open-Meteo Rules', external_id: `rule-rain-orange-${city.name}-${Date.now()}`,
          state: city.state, district: city.name, hazard: 'Flood', severity: 'Orange',
          headline: `Heavy Rain Advisory for ${city.name} (${rainfall} mm)`, templateKey: 'HEAVY_RAIN_ORANGE',
          lat: city.lat, lng: city.lng
        }));
      }

      if (temp >= 42 && (city.state === 'Telangana' || city.state === 'Andhra Pradesh')) {
        generatedAlerts.push(normalizeAlert({
          source: 'Open-Meteo Rules', external_id: `rule-heat-orange-${city.name}-${Date.now()}`,
          state: city.state, district: city.name, hazard: 'Heatwave', severity: 'Orange',
          headline: `Severe Heatwave Warning in ${city.name} (${temp}°C)`, templateKey: 'EXTREME_HEAT_ORANGE',
          lat: city.lat, lng: city.lng
        }));
      }

    } catch (err) {
      console.error(`Weather ingest error for ${city.name}:`, err.message);
    }
  }

  return { weatherRecords, generatedAlerts };
}

module.exports = { ingestWeatherData };
