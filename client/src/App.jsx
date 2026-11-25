import React, { useState, useEffect } from 'react';
import './styles/glass.css';
import SouthIndiaHeroMap from './components/SouthIndiaHeroMap';
import DistrictLeafletMap from './components/DistrictLeafletMap';
import AlertDetailDrawer from './components/AlertDetailDrawer';
import ReportSOSModal from './components/ReportSOSModal';
import { Home, BarChart2, Globe, Settings, Search } from 'lucide-react';

function App() {
  const [selectedState, setSelectedState] = useState('All');
  const [language, setLanguage] = useState('en');
  const [mapMode, setMapMode] = useState('hero');
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [helplines, setHelplines] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isSosOpen, setIsSosOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const sRes = await fetch(`http://localhost:5000/api/v1/summary?state=${selectedState}`);
        if (sRes.ok) setSummary(await sRes.json());

        const aRes = await fetch(`http://localhost:5000/api/v1/alerts?state=${selectedState}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          setAlerts(aData.alerts || []);
        }

        const hRes = await fetch(`http://localhost:5000/api/v1/helplines?state=${selectedState}`);
        if (hRes.ok) {
          const hData = await hRes.json();
          setHelplines(hData.helplines || []);
        }
      } catch (e) {
        console.warn("Backend not accessible, falling back to initial view state", e);
        // Fallback default state so frontend renders cleanly even if backend is offline
        setSummary({
          hero: { activeAlerts: 4, delta: "+3 vs last 24 h" },
          kpis: {
            redAlerts: { count: 1, delta: "+1 vs 24h" },
            districtsUnderWatch: { count: 6, delta: "+2 vs 24h" },
            avgRainfall: { value: "34.5 mm", delta: "+12.4% vs 24h" }
          },
          hazardCounts: { Floods: 2, Cyclones: 1, Heatwaves: 1, Landslides: 0 },
          stateSeverities: { 'Telangana': 'Red', 'Andhra Pradesh': 'Orange', 'Tamil Nadu': 'Yellow', 'Kerala': 'Green' }
        });
        setAlerts([
          {
            id: "fallback-1",
            source: "SYSTEM",
            state: "Telangana",
            district: "Hyderabad",
            hazard: "Flood",
            severity: "Red",
            headline: "RED ALERT: Severe Urban Inundation Warning",
            description: { en: "Extremely heavy rainfall detected. Waterlogging in low lying areas.", te: "అత్యంత భారీ వర్షం నమోదైంది. తీవ్రమైన వరద ముప్పు." },
            latitude: 17.3850,
            longitude: 78.4867
          },
          {
            id: "fallback-2",
            source: "SYSTEM",
            state: "Andhra Pradesh",
            district: "Visakhapatnam",
            hazard: "Cyclone",
            severity: "Orange",
            headline: "ORANGE ALERT: Coastal Cyclone Watch",
            description: { en: "Cyclonic depression over Bay of Bengal approaching coast.", te: "తీర ప్రాంతంలో తుఫాను ప్రభావం." },
            latitude: 17.6868,
            longitude: 83.2185
          }
        ]);
        setHelplines([
          { id: "h-1", state: "Telangana", name: "Telangana Disaster Control Room", phone_number: "1070" },
          { id: "h-2", state: "Andhra Pradesh", name: "AP State Emergency Ops", phone_number: "1070" },
          { id: "h-3", state: "Tamil Nadu", name: "TN Disaster Management", phone_number: "1070" },
          { id: "h-4", state: "Kerala", name: "Kerala State Ops Centre", phone_number: "1077" }
        ]);
      }
    };
    load();
  }, [selectedState]);

  if (!summary) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading SIDAS Glass Engine...</div>;

  return (
    <div className="glass-container">
      <aside style={{ width: '64px', borderRight: '1px solid var(--glass-border)', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1f8a4c, #2fa866)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>🛡️</div>
          <button style={{ background: 'var(--primary-accent-light)', border: 'none', padding: '10px', borderRadius: '12px', color: 'var(--primary-accent)' }}><Home size={20}/></button>
          <button style={{ background: 'none', border: 'none', color: '#64748b' }}><BarChart2 size={20}/></button>
          <button style={{ background: 'none', border: 'none', color: '#64748b' }}><Globe size={20}/></button>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#64748b' }}><Settings size={20}/></button>
      </aside>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>South India Disaster <span style={{ color: '#1f8a4c' }}>Watch</span></h1>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Telangana | Andhra Pradesh | Tamil Nadu | Kerala</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsSosOpen(true)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>🚨 SOS Report</button>
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="All">All South States</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
            </select>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
              <option value="ml">മലയാളം</option>
            </select>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 300px', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-card">
              <span style={{ fontSize: '13px', color: '#64748b' }}>Active Regional Alerts</span>
              <div style={{ fontSize: '44px', fontWeight: 800, margin: '6px 0' }}>{summary.hero.activeAlerts}</div>
              <span className="delta-chip red">↑ {summary.hero.delta}</span>
            </div>
            <div className="glass-card"><span style={{ fontSize: '12px', color: '#64748b' }}>Red Alerts</span><div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>{summary.kpis.redAlerts.count}</div></div>
            <div className="glass-card"><span style={{ fontSize: '12px', color: '#64748b' }}>Districts Under Watch</span><div style={{ fontSize: '20px', fontWeight: 800 }}>{summary.kpis.districtsUnderWatch.count}</div></div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
              <button onClick={() => setMapMode('hero')} style={{ padding: '4px 10px', borderRadius: '6px', background: mapMode==='hero'?'#1f8a4c':'#fff', color: mapMode==='hero'?'#fff':'#333', border: 'none', cursor: 'pointer', fontSize: '11px' }}>SVG Map</button>
              <button onClick={() => setMapMode('leaflet')} style={{ padding: '4px 10px', borderRadius: '6px', background: mapMode==='leaflet'?'#1f8a4c':'#fff', color: mapMode==='leaflet'?'#fff':'#333', border: 'none', cursor: 'pointer', fontSize: '11px' }}>Leaflet Map</button>
            </div>
            {mapMode === 'hero' ? <SouthIndiaHeroMap alerts={alerts} stateSeverities={summary.stateSeverities} onSelectAlert={setSelectedAlert}/> : <DistrictLeafletMap alerts={alerts} onSelectAlert={setSelectedAlert}/>}
          </div>

          <div className="glass-card">
            <h4 style={{ margin: '0 0 10px 0' }}>Hazard Breakdown</h4>
            {Object.entries(summary.hazardCounts).map(([h, c]) => (
              <div key={h} style={{ marginBottom: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{h}</span><strong>{c}</strong></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDetailDrawer alert={selectedAlert} language={language} onClose={() => setSelectedAlert(null)} helplines={helplines} />
      <ReportSOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} selectedState={selectedState} />
    </div>
  );
}

export default App;
