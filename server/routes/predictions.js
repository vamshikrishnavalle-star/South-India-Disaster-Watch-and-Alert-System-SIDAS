// server/routes/predictions.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { predictDistrictRisk } = require('../services/mlInference');

const DEFAULT_WEATHER_HUBS = [
  { city: 'Hyderabad', state: 'Telangana', temp_c: 34.2, rainfall_mm: 12.0, wind_kmph: 18.5, humidity: 62 },
  { city: 'Warangal', state: 'Telangana', temp_c: 33.8, rainfall_mm: 5.0, wind_kmph: 14.0, humidity: 65 },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', temp_c: 31.5, rainfall_mm: 45.0, wind_kmph: 68.0, humidity: 82 },
  { city: 'Vijayawada', state: 'Andhra Pradesh', temp_c: 35.0, rainfall_mm: 18.0, wind_kmph: 22.0, humidity: 70 },
  { city: 'Chennai', state: 'Tamil Nadu', temp_c: 32.0, rainfall_mm: 38.0, wind_kmph: 42.0, humidity: 80 },
  { city: 'Coimbatore', state: 'Tamil Nadu', temp_c: 28.5, rainfall_mm: 15.0, wind_kmph: 16.0, humidity: 74 },
  { city: 'Kochi', state: 'Kerala', temp_c: 29.8, rainfall_mm: 85.0, wind_kmph: 35.0, humidity: 88 },
  { city: 'Wayanad (Kalpetta)', state: 'Kerala', temp_c: 24.0, rainfall_mm: 120.0, wind_kmph: 28.0, humidity: 95 }
];

router.get('/predictions', async (req, res) => {
  const { state = 'All' } = req.query;

  try {
    let weatherData = null;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      let wQuery = supabase.from('weather_cache').select('*');
      if (state !== 'All') wQuery = wQuery.eq('state', state);

      const { data, error } = await wQuery;
      if (!error && data && data.length > 0) {
        weatherData = data;
      }
    }

    if (!weatherData) {
      weatherData = state === 'All' 
        ? DEFAULT_WEATHER_HUBS 
        : DEFAULT_WEATHER_HUBS.filter(w => w.state === state);
    }

    const predictions = (weatherData || []).map(w => {
      let elevation = 50;
      let coastalDist = 150;

      if (w.city.includes('Wayanad') || w.city.includes('Idukki')) elevation = 900;
      if (w.city.includes('Coimbatore')) elevation = 410;
      if (w.city.includes('Visakhapatnam') || w.city.includes('Chennai') || w.city.includes('Kochi')) coastalDist = 5;

      const mlResult = predictDistrictRisk({
        rain_24h: w.rainfall_mm,
        rain_48h: (w.rainfall_mm || 0) * 1.8,
        wind_speed: w.wind_kmph,
        temp_c: w.temp_c,
        humidity: w.humidity,
        elevation_m: elevation,
        coastal_dist_km: coastalDist
      });

      return {
        city: w.city,
        state: w.state,
        current_metrics: { temp: w.temp_c, rain_24h: w.rainfall_mm, wind: w.wind_kmph },
        prediction: mlResult
      };
    });

    res.json({
      success: true,
      model: "SIDAS Random Forest Risk Predictor v1.0",
      timestamp: new Date().toISOString(),
      predictions
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
