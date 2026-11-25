const translations = {
  HEAVY_RAIN_RED: {
    en: "RED ALERT: Extremely heavy rainfall detected. Severe flood & waterlogging risk.",
    te: "రెడ్ అలర్ట్: అత్యంత భారీ వర్షం నమోదైంది. తీవ్రమైన వరద మరియు నీటి ముంపు ప్రమాదం.",
    ta: "சிவப்பு எச்சரிக்கை: மிகக் பலத்த மழை பதிவாகியுள்ளது. கடுமையான வெள்ள அபாயம்.",
    ml: "റെഡ് അലർട്ട്: അതിശക്തമായ മഴ രേഖപ്പെടുത്തി. കനത്ത വെള്ളപ്പൊക്ക സാധ്യത."
  },
  HEAVY_RAIN_ORANGE: {
    en: "ORANGE ALERT: Heavy downpour in progress. Be prepared for localized inundation.",
    te: "ఆరెంజ్ అలర్ట్: భారీ వర్షం కురుస్తోంది. స్థానిక వరదలకు సిద్ధంగా ఉండండి.",
    ta: "ஆரஞ்சு எச்சரிக்கை: பலத்த மழை பெய்து வருகிறது. உள்ளூர் வெள்ளத்திற்கு தயராக இருக்கவும்.",
    ml: "ഓറഞ്ച് അലർട്ട്: കനത്ത മഴ തുടരുന്നു. പ്രാദേശിക വെള്ളപ്പൊക്ക ജാഗ്രത വേണം."
  },
  EXTREME_HEAT_ORANGE: {
    en: "ORANGE ALERT: Severe heatwave conditions. Temperatures exceeding normal thresholds.",
    te: "ఆరెంజ్ అలర్ట్: తీవ్రమైన వడగాల్పులు. తీవ్రమైన ఎండల పట్ల జాగ్రత్త వహించండి.",
    ta: "ஆரஞ்சு எச்சரிக்கை: கடுமையான வெப்ப அலை. அதிக வெப்பம் நிலவுகிறது.",
    ml: "ഓറഞ്ച് അലർട്ട്: കടുത്ത ഉഷ്ണതരംഗം. സൂര്യാഘാത സാധ്യത ജാഗ്രത പാലിക്കുക."
  },
  CYCLONE_WARNING_ORANGE: {
    en: "ORANGE ALERT: Cyclonic storm / deep depression active off the coastal region.",
    te: "ఆరెంజ్ అలర్ట్: తీర ప్రాంతంలో తుఫాను / తీవ్ర వాయుగుండం ప్రభావం.",
    ta: "ஆரஞ்சு எச்சரிக்கை: கடலோர பகுதியில் புயல் / தீவிர காற்றழுத்த தாழ்வு மண்டலம்.",
    ml: "ഓറഞ്ച് അലർട്ട്: തീരദേശത്ത് ചുഴലിക്കാറ്റ് / തീവ്ര ന്യൂനമർദ്ദ മുന്നറിയിപ്പ്."
  }
};

function normalizeAlert({
  source, external_id, state, district, hazard, severity, headline, templateKey, rawDescription, instruction, lat, lng, radius_km = 30
}) {
  const descriptionDict = translations[templateKey] || {
    en: rawDescription || headline, te: rawDescription || headline, ta: rawDescription || headline, ml: rawDescription || headline
  };

  return {
    source: source || 'SYSTEM',
    external_id: external_id || `sys-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    state,
    district: district || 'Statewide',
    hazard, severity,
    urgency: severity === 'Red' ? 'Immediate' : 'Expected',
    headline,
    description: descriptionDict,
    instruction: instruction || { en: "Follow official local administration advisories and stay tuned to updates." },
    latitude: lat ? parseFloat(lat) : null,
    longitude: lng ? parseFloat(lng) : null,
    radius_km,
    is_active: true,
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
}

module.exports = { normalizeAlert, translations };
