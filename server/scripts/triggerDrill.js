require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { sendTelegramAlert } = require('../services/telegramBot');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function executeEmergencyDrill() {
  console.log("⚡ INITIATING LIVE DISASTER DRILL SIMULATION...");
  const drillAlert = {
    source: "EXAMINER_DRILL",
    external_id: `drill-${Date.now()}`,
    state: "Telangana", district: "Hyderabad & Medchal",
    hazard: "Flood", severity: "Red", urgency: "Immediate",
    headline: "DRILL: RED ALERT - Severe Urban Flash Flood Warning",
    description: {
      en: "SIMULATION DRILL: Heavy downpour (>150mm) causing inundation in Hyderabad lower zones.",
      te: "డ్రిల్ ప్రకటన: హైదరాబాద్ నగరంలో అత్యంత భారీ వర్షాలు మరియు వరద ముప్పు.",
      ta: "அவசர சோதனை: ஹைதராபாத்தில் மிகக் பலத்த மழை எச்சரிக்கை.",
      ml: "ഫ്ലാഷ് ഫ്ലഡ് റെഡ് അലർട്ട് സിമുലേഷൻ."
    },
    instruction: { en: "Evacuate low-lying areas immediately." },
    latitude: 17.3850, longitude: 78.4867, radius_km: 40, is_active: true
  };

  await supabase.from('alerts').insert([drillAlert]);
  await sendTelegramAlert(drillAlert);
  console.log("🚀 DRILL TRIGGERED SUCCESSFULLY!");
}

executeEmergencyDrill();
