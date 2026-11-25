const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.post('/subscribe', async (req, res) => {
  const { channel, endpoint_or_chatid, subscribed_states, min_severity, preferred_language } = req.body;
  try {
    const { error } = await supabase.from('subscriptions').upsert({
      channel: channel || 'WebPush', endpoint_or_chatid,
      subscribed_states: subscribed_states || ['Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'],
      min_severity: min_severity || 'Orange', preferred_language: preferred_language || 'en'
    }, { onConflict: 'endpoint_or_chatid' });

    if (error) throw error;
    res.status(201).json({ success: true, message: "Subscribed." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
