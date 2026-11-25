const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.get('/health', (req, res) => {
  res.json({ system: "SIDAS Engine", status: "HEALTHY", timestamp: new Date().toISOString() });
});

router.get('/alerts', async (req, res) => {
  const { state, district, hazard, severity } = req.query;
  try {
    let q = supabase.from('alerts').select('*').eq('is_active', true).order('issued_at', { ascending: false });
    if (state && state !== 'All') q = q.eq('state', state);
    if (district && district !== 'All') q = q.eq('district', district);
    if (hazard && hazard !== 'All') q = q.eq('hazard', hazard);
    if (severity && severity !== 'All') q = q.eq('severity', severity);

    const { data, error } = await q;
    if (error) throw error;

    res.json({ success: true, count: data.length, alerts: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/helplines', async (req, res) => {
  const { state } = req.query;
  try {
    let q = supabase.from('helplines').select('*');
    if (state && state !== 'All') q = q.eq('state', state);

    const { data, error } = await q;
    if (error) throw error;

    res.json({ success: true, helplines: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
