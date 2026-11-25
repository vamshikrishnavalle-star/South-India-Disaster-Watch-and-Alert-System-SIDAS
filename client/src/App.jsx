import React, { useState, useEffect } from 'react';
import './styles/glass.css';
import SouthIndiaHeroMap from './components/SouthIndiaHeroMap';
import DistrictLeafletMap from './components/DistrictLeafletMap';
import AlertDetailDrawer from './components/AlertDetailDrawer';
import ReportSOSModal from './components/ReportSOSModal';
import AIPredictionPanel from './components/AIPredictionPanel';
import KeralaFloodBasinSection from './components/KeralaFloodBasinSection';
import TelanganaDisasterSection from './components/TelanganaDisasterSection';
import AndhraPradeshDisasterSection from './components/AndhraPradeshDisasterSection';
import { Home, BarChart2, Globe, Settings, Volume2, AlertTriangle, ShieldCheck } from 'lucide-react';

const FALLBACK_SUMMARY = {
  hero: { activeAlerts: 6, delta: "+3 vs last 24 h" },
  kpis: {
    redAlerts: { count: 2, delta: "+1 vs 24h" },
    districtsUnderWatch: { count: 8, delta: "+2 vs 24h" },
    avgRainfall: { value: "58.4 mm", delta: "+14.2% vs 24h" }
  },
  hazardCounts: { Floods: 3, Cyclones: 1, Heatwaves: 1, Landslides: 1 },
  stateSeverities: {
    'Telangana': 'Red',
    'Andhra Pradesh': 'Orange',
    'Tamil Nadu': 'Yellow',
    'Kerala': 'Red'
  }
};

const FALLBACK_ALERTS = [
  {
    id: "alert-ts-1",
    source: "IMD / GHMC Radar",
    state: "Telangana",
    district: "Hyderabad & Medchal",
    hazard: "Flood",
    severity: "Red",
    urgency: "Immediate",
    headline: "RED ALERT: Severe Urban Flash Flood & Inundation Warning",
    description: {
      en: "Extremely heavy rainfall (>140mm) recorded across Musi catchment. Low-lying colonies facing severe inundation.",
      te: "హైదరాబాద్ మరియు మేడ్చల్ పరిధిలో అత్యంత భారీ వర్షాలు. మూసీ నది పరీవాహక ప్రాంతాల ప్రజలు అప్రమత్తంగా ఉండాలి.",
      ta: "ஹைதராபாத்தில் அதி தீவிர கனமழை மற்றும் வெள்ள அபாய எச்சரிக்கை.",
      ml: "ഹൈദരാബാദിൽ അതിശക്തമായ മഴയും നഗര വെള്ളപ്പൊക്ക മുന്നറിയിപ്പും."
    },
    instruction: { en: "Evacuate basement parking and stay indoors. Call GHMC 040-21111111 for rescue." },
    latitude: 17.3850,
    longitude: 78.4867
  },
  {
    id: "alert-ap-1",
    source: "JTWC / IMD Cyclone Watch",
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    hazard: "Cyclone",
    severity: "Orange",
    urgency: "Expected",
    headline: "ORANGE ALERT: Deep Depression Approaching Coastal Andhra",
    description: {
      en: "Squally winds reaching 65-75 kmph along north Andhra coast. Sea condition rough to very rough.",
      te: "తీర ప్రాంతంలో బలమైన ఈదురు గాలులు (75 కి.మీ/గం). మత్స్యకారులు వేటకు వెళ్ళరాదు.",
      ta: "வடக்கு ஆந்திர கடலோர பகுதியில் பலத்த காற்று எச்சரிக்கை.",
      ml: "ആന്ധ്രാ തീരത്ത് ശക്തമായ കാറ്റും കടലാക്രമണ സാധ്യതയും."
    },
    instruction: { en: "Fishermen advised not to venture into deep sea. Secure outdoor structures." },
    latitude: 17.6868,
    longitude: 83.2185
  },
  {
    id: "alert-kl-1",
    source: "SDMA / CWC Ingestion",
    state: "Kerala",
    district: "Wayanad (Meppadi / Vythiri)",
    hazard: "Landslide",
    severity: "Red",
    urgency: "Immediate",
    headline: "RED ALERT: Severe Landslide & Debris Flow Hazard",
    description: {
      en: "Excess cumulative 48h rainfall (>220mm) saturating high-gradient tea estate slopes. High debris flow risk.",
      te: "వయనాడ్ పర్వత ప్రాంతాల్లో కొండచరియలు విరిగిపడే తీవ్ర ప్రమాదం.",
      ta: "വയനാട് മലയോര മേഖലയിൽ മണ്ണിടിച്ചിൽ സാധ്യത അതീവ ജാഗ്രത.",
      ml: "വയനാട് മലയോര മേഖലയിൽ മണ്ണിടിച്ചിലിന് സാധ്യത. അതീവ ജാഗ്രതാ നിർദ്ദേശം."
    },
    instruction: { en: "Relocate from vulnerable hillsides to designated relief camps immediately." },
    latitude: 11.6103,
    longitude: 76.0827
  },
  {
    id: "alert-tn-1",
    source: "Regional Met Centre Chennai",
    state: "Tamil Nadu",
    district: "Chennai & Kanchipuram",
    hazard: "Flood",
    severity: "Yellow",
    urgency: "Expected",
    headline: "YELLOW ALERT: Moderate to Heavy Monsoon Showers",
    description: {
      en: "Adyar and Cooum basins receiving intermittent heavy spells. Waterlogging expected in low-lying subways.",
      te: "చెన్నై నగరంలో భారీ వర్షాలు. ట్రాఫిక్ మళ్లింపులను గమనించండి.",
      ta: "சென்னையில் பரவலாக கனமழை. தாழ்வான பகுதிகளில் நீர் தேங்க வாய்ப்பு.",
      ml: "ചെന്നൈയിൽ മിതമായ തോതിൽ മഴ തുടരുന്നു.",
      kn: "ಚೆನ್ನೈ ಕರಾವಳಿ ಭಾಗದಲ್ಲಿ ಸಾಧಾರಣದಿಂದ ಭಾರಿ ಮಳೆ."
    },
    instruction: { en: "Plan urban transit carefully and monitor GCC emergency advisories." },
    latitude: 13.0827,
    longitude: 80.2707
  },
  {
    id: "alt-ka-1",
    source: "KSNDMC / IMD Bengaluru",
    external_id: "init-alert-blr-05",
    state: "Karnataka",
    district: "Bengaluru (Urban & Rural)",
    hazard: "Flood",
    severity: "Yellow",
    urgency: "Expected",
    headline: "YELLOW ALERT: Moderate Inundation & Urban Runoff Advisory",
    description: {
      en: "Bellandur and Varthur valley catchment receiving convective spells. Waterlogging expected in underpasses.",
      te: "బెంగళూరు నగరంలో భారీ వర్షాలు. లోతట్టు ప్రాంతాలలో నీటి ముంపు ప్రమాదం.",
      ta: "பெங்களூரு நகரில் பரவலாக மழை. சுரங்கப்பாதைகளில் நீர் தேங்க வாய்ப்பு.",
      ml: "ബെംഗളൂരു നഗരത്തിൽ മിതമായ തോതിൽ മഴ സാധ്യത.",
      kn: "ಬೆಂಗಳೂರು ನಗರ ಮತ್ತು ಸುತ್ತಮುತ್ತ ಸಾಧಾರಣದಿಂದ ಭಾರಿ ಮಳೆ. ತಗ್ಗು ಪ್ರದೇಶಗಳಲ್ಲಿ ನೀರು ನಿಲ್ಲುವ ಎಚ್ಚರಿಕೆ."
    },
    instruction: { en: "Avoid waterlogged underpasses; monitor BBMP flood control advisories." },
    latitude: 12.9716,
    longitude: 77.5946
  }
];

const FALLBACK_HELPLINES = [
  { id: "h-ts-1", state: "Telangana", district: "Statewide", name: "Telangana Disaster Control Room", phone_number: "1070" },
  { id: "h-ts-2", state: "Telangana", district: "Hyderabad", name: "GHMC Emergency Control Room", phone_number: "040-21111111" },
  { id: "h-ap-1", state: "Andhra Pradesh", district: "Statewide", name: "AP State Emergency Ops Centre", phone_number: "1070" },
  { id: "h-ap-2", state: "Andhra Pradesh", district: "Visakhapatnam", name: "GVMC Disaster Cell", phone_number: "0891-2869100" },
  { id: "h-tn-1", state: "Tamil Nadu", district: "Statewide", name: "TN State Disaster Management Authority", phone_number: "1070" },
  { id: "h-tn-2", state: "Tamil Nadu", district: "Chennai", name: "GCC Flood Control Room", phone_number: "1913" },
  { id: "h-kl-1", state: "Kerala", district: "Statewide", name: "Kerala State Emergency Operations Centre", phone_number: "1077" },
  { id: "h-kl-2", state: "Kerala", district: "Wayanad", name: "Wayanad Collectorate Emergency Ops", phone_number: "04936-204151" },
  { id: "h-ka-1", state: "Karnataka", district: "Statewide", name: "Karnataka State Disaster Management Authority", phone_number: "1070" },
  { id: "h-ka-2", state: "Karnataka", district: "Bengaluru", name: "BBMP Disaster Control Room", phone_number: "1533" }
];

function App() {
  const [selectedState, setSelectedState] = useState('All');
  const [language, setLanguage] = useState('en');
  const [mapMode, setMapMode] = useState('leaflet');
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [helplines, setHelplines] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);

  // Synthesized Web Audio Siren for Red Alerts
  const triggerAudioSiren = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(940, now + 0.4);
      osc.frequency.linearRampToValueAtTime(520, now + 0.8);
      osc.frequency.linearRampToValueAtTime(940, now + 1.2);
      osc.frequency.linearRampToValueAtTime(520, now + 1.6);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 1.8);

      setSirenPlaying(true);
      setTimeout(() => setSirenPlaying(false), 1800);
    } catch (e) {
      console.warn("Web audio unavailable", e);
    }
  };

  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

    const load = async () => {
      try {
        const fetchEndpoint = async (path) => {
          if (apiBase) {
            try {
              const r = await fetch(`${apiBase}${path}`);
              if (r.ok) return await r.json();
            } catch (_) {}
          }
          try {
            const r = await fetch(path);
            if (r.ok) return await r.json();
          } catch (_) {}
          try {
            const r = await fetch(`http://localhost:5000${path}`);
            if (r.ok) return await r.json();
          } catch (_) {}
          return null;
        };

        const sData = await fetchEndpoint(`/api/v1/summary?state=${selectedState}`);
        if (sData && sData.success) {
          setSummary(sData);
        } else {
          // Dynamic filter on fallback
          if (selectedState === 'All') {
            setSummary(FALLBACK_SUMMARY);
          } else {
            const stateAlerts = FALLBACK_ALERTS.filter(a => a.state === selectedState);
            setSummary({
              ...FALLBACK_SUMMARY,
              hero: { activeAlerts: stateAlerts.length, delta: "+1 vs 24h" },
              kpis: {
                redAlerts: { count: stateAlerts.filter(a => a.severity === 'Red').length, delta: "+0 vs 24h" },
                districtsUnderWatch: { count: stateAlerts.length, delta: "+1 vs 24h" },
                avgRainfall: { value: "42.0 mm", delta: "+8.5% vs 24h" }
              }
            });
          }
        }

        const aData = await fetchEndpoint(`/api/v1/alerts?state=${selectedState}`);
        if (aData && aData.alerts && aData.alerts.length > 0) {
          setAlerts(aData.alerts);
        } else {
          setAlerts(selectedState === 'All' ? FALLBACK_ALERTS : FALLBACK_ALERTS.filter(a => a.state === selectedState));
        }

        const hData = await fetchEndpoint(`/api/v1/helplines?state=${selectedState}`);
        if (hData && hData.helplines && hData.helplines.length > 0) {
          setHelplines(hData.helplines);
        } else {
          setHelplines(selectedState === 'All' ? FALLBACK_HELPLINES : FALLBACK_HELPLINES.filter(h => h.state === selectedState));
        }

      } catch (err) {
        console.warn("Using offline fallback telemetry", err);
        setSummary(FALLBACK_SUMMARY);
        setAlerts(FALLBACK_ALERTS);
        setHelplines(FALLBACK_HELPLINES);
      }
    };

    load();
    if (selectedState === 'Telangana') {
      const el = document.getElementById('section-telangana');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (selectedState === 'Andhra Pradesh') {
      const el = document.getElementById('section-andhra');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (selectedState === 'Kerala') {
      const el = document.getElementById('section-kerala');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedState]);

  if (!summary) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading SIDAS Glass Engine...</div>;

  return (
    <div className="glass-container">
      <aside style={{ width: '64px', borderRight: '1px solid var(--glass-border)', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1f8a4c, #2fa866)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>🛡️</div>
          <button style={{ background: 'var(--primary-accent-light)', border: 'none', padding: '10px', borderRadius: '12px', color: 'var(--primary-accent)', cursor: 'pointer' }}><Home size={20}/></button>
          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><BarChart2 size={20}/></button>
          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><Globe size={20}/></button>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><Settings size={20}/></button>
      </aside>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>South India Disaster <span style={{ color: '#1f8a4c' }}>Watch & Alert System</span></h1>
              <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>SIDAS v2.0</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Telangana | Andhra Pradesh | Tamil Nadu | Kerala | Karnataka</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={triggerAudioSiren}
              style={{
                background: sirenPlaying ? '#991b1b' : '#fef2f2',
                color: sirenPlaying ? '#fff' : '#dc2626',
                border: '1px solid #fecaca',
                padding: '8px 12px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
              title="Test Emergency Audio Siren"
            >
              <Volume2 size={16}/> {sirenPlaying ? 'Siren Active!' : 'Test Siren'}
            </button>

            <button onClick={() => setIsSosOpen(true)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🚨 SOS Report
            </button>

            <select value={selectedState} onChange={e => setSelectedState(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
              <option value="All">All South States (5)</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
              <option value="Karnataka">Karnataka</option>
            </select>

            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
              <option value="en">English (EN)</option>
              <option value="te">తెలుగు (TE)</option>
              <option value="ta">தமிழ் (TA)</option>
              <option value="ml">മലയാളം (ML)</option>
              <option value="kn">ಕನ್ನಡ (KN)</option>
            </select>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 320px', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-card">
              <span style={{ fontSize: '13px', color: '#64748b' }}>Active Regional Alerts</span>
              <div style={{ fontSize: '44px', fontWeight: 800, margin: '6px 0' }}>{summary.hero.activeAlerts}</div>
              <span className="delta-chip red">↑ {summary.hero.delta}</span>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: '12px', color: '#64748b' }}>Red Alerts (Severe)</span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626' }}>{summary.kpis.redAlerts.count}</div>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: '12px', color: '#64748b' }}>Districts Under Watch</span>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{summary.kpis.districtsUnderWatch.count}</div>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: '12px', color: '#64748b' }}>Average 24h Rainfall</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0369a1' }}>{summary.kpis.avgRainfall.value}</div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
              <button onClick={() => setMapMode('leaflet')} style={{ padding: '5px 12px', borderRadius: '8px', background: mapMode==='leaflet'?'#1f8a4c':'#fff', color: mapMode==='leaflet'?'#fff':'#333', border: '1px solid ' + (mapMode==='leaflet'?'#1f8a4c':'#e2e8f0'), cursor: 'pointer', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>Leaflet District Radar (Primary)</button>
              <button onClick={() => setMapMode('hero')} style={{ padding: '5px 12px', borderRadius: '8px', background: mapMode==='hero'?'#1f8a4c':'#fff', color: mapMode==='hero'?'#fff':'#333', border: '1px solid ' + (mapMode==='hero'?'#1f8a4c':'#e2e8f0'), cursor: 'pointer', fontSize: '11px', fontWeight: 600, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>SVG Regional Map</button>
            </div>
            {mapMode === 'hero' ? <SouthIndiaHeroMap alerts={alerts} stateSeverities={summary.stateSeverities} onSelectAlert={setSelectedAlert}/> : <DistrictLeafletMap alerts={alerts} onSelectAlert={setSelectedAlert}/>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AIPredictionPanel selectedState={selectedState} />

            <div className="glass-card">
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} color="#ea580c"/> Hazard Breakdown
              </h4>
              {Object.entries(summary.hazardCounts).map(([h, c]) => (
                <div key={h} style={{ marginBottom: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>{h}</span>
                    <strong style={{ color: c > 0 ? '#0f172a' : '#94a3b8' }}>{c} active</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dedicated State Deep-Dive Intelligence Sections (Stacked Sequentially) */}
        <div style={{ marginTop: '28px', borderTop: '2px solid #e2e8f0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                State-Specific Disaster Intelligence Deep-Dives
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Dedicated hydrological gauge networks, ML risk models & historical telemetry for each state (One under one)
              </p>
            </div>
            
            {/* Quick-Jump Section Navigation Bar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('section-telangana');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #ddd6fe',
                  background: '#f5f3ff',
                  color: '#6d28d9',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s ease'
                }}
              >
                ⚡ Telangana Disaster Watch ↓
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('section-andhra');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #ffedd5',
                  background: '#fff7ed',
                  color: '#c2410c',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s ease'
                }}
              >
                🌀 Andhra Pradesh Delta & Cyclone ↓
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('section-kerala');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #bae6fd',
                  background: '#f0f9ff',
                  color: '#0369a1',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s ease'
                }}
              >
                🌊 Kerala River Basins ↓
              </button>
            </div>
          </div>

          {/* Section 1: Telangana */}
          <div id="section-telangana" style={{ scrollMarginTop: '20px' }}>
            <TelanganaDisasterSection />
          </div>

          <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />

          {/* Section 2: Andhra Pradesh */}
          <div id="section-andhra" style={{ scrollMarginTop: '20px' }}>
            <AndhraPradeshDisasterSection />
          </div>

          <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />

          {/* Section 3: Kerala */}
          <div id="section-kerala" style={{ scrollMarginTop: '20px' }}>
            <KeralaFloodBasinSection />
          </div>
        </div>
      </div>

      <AlertDetailDrawer alert={selectedAlert} language={language} onClose={() => setSelectedAlert(null)} helplines={helplines} />
      <ReportSOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} selectedState={selectedState} />
    </div>
  );
}

export default App;
