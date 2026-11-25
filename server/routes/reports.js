const express = require('express');
const router = express.Router();
const { sosReportLimiter } = require('../middleware/security');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.post('/reports', sosReportLimiter, async (req, res) => {
  const { reporter_name, phone_number, state, district, incident_type, description, latitude, longitude } = req.body;
  try {
    const { data, error } = await supabase.from('reports').insert([{
      reporter_name, phone_number, state, district, type: incident_type, description,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null
    }]).select();

    if (error) throw error;
    res.status(201).json({ success: true, message: "SOS logged.", id: data[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
