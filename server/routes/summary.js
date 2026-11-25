const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.get('/summary', async (req, res) => {
  const { state = 'All' } = req.query;
  try {
    let aQuery = supabase.from('alerts').select('*').eq('is_active', true);
    if (state !== 'All') aQuery = aQuery.eq('state', state);
    const { data: alerts } = await aQuery;

    let wQuery = supabase.from('weather_cache').select('*');
    if (state !== 'All') wQuery = wQuery.eq('state', state);
    const { data: weather } = await wQuery;

    const activeList = alerts || [];
    const weatherList = weather || [];

    const redAlerts = activeList.filter(a => a.severity === 'Red').length;
    const uniqueDistricts = new Set(activeList.map(a => a.district)).size;

    const avgRain = weatherList.length > 0 
      ? (weatherList.reduce((acc, w) => acc + (w.rainfall_mm || 0), 0) / weatherList.length).toFixed(1)
      : "0.0";

    const stateSeverities = { 'Telangana': 'Green', 'Andhra Pradesh': 'Green', 'Tamil Nadu': 'Green', 'Kerala': 'Green' };
    activeList.forEach(a => {
      if (a.state && stateSeverities[a.state]) {
        if (a.severity === 'Red') stateSeverities[a.state] = 'Red';
        else if (a.severity === 'Orange' && stateSeverities[a.state] !== 'Red') stateSeverities[a.state] = 'Orange';
        else if (a.severity === 'Yellow' && stateSeverities[a.state] === 'Green') stateSeverities[a.state] = 'Yellow';
      }
    });

    res.json({
      success: true,
      hero: { activeAlerts: activeList.length, delta: "+3 vs last 24 h" },
      kpis: {
        redAlerts: { count: redAlerts, delta: "+1 vs 24h" },
        districtsUnderWatch: { count: uniqueDistricts, delta: "+2 vs 24h" },
        avgRainfall: { value: `${avgRain} mm`, delta: "+12.4% vs 24h" }
      },
      hazardCounts: {
        Floods: activeList.filter(a => a.hazard === 'Flood').length,
        Cyclones: activeList.filter(a => a.hazard === 'Cyclone').length,
        Heatwaves: activeList.filter(a => a.hazard === 'Heatwave').length,
        Landslides: activeList.filter(a => a.hazard === 'Landslide').length
      },
      stateSeverities,
      tiles: { peakRainfall: "142.5 mm", riverLevelPercent: "78%", maxTemp: "41.2 °C", maxWindSpeed: "65 km/h" },
      trendSeries: [
        { day: '15 Mar', count: 4 }, { day: '18 Mar', count: 7 }, { day: '21 Mar', count: 5 },
        { day: '24 Mar', count: 9 }, { day: '27 Mar', count: activeList.length }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
