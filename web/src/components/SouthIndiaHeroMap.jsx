import React, { useState } from 'react';

const SouthIndiaHeroMap = ({ alerts = [], stateSeverities = {}, onSelectAlert }) => {
  const [activeHazard, setActiveHazard] = useState('All');

  const getFill = (st) => {
    const s = stateSeverities[st] || 'Green';
    if (s === 'Red') return '#fecaca';
    if (s === 'Orange') return '#fed7aa';
    if (s === 'Yellow') return '#fef08a';
    return '#e0f2fe';
  };

  const filtered = alerts.filter(a => activeHazard === 'All' || a.hazard === activeHazard);

  return (
    <div className="glass-card" style={{ position: 'relative', height: '540px', overflow: 'hidden', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 10, position: 'relative' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>South India Risk Map</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Live Regional Hazard Radar</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Flood', 'Cyclone', 'Heatwave', 'Landslide'].map(h => (
            <button key={h} onClick={() => setActiveHazard(h)} style={{ background: activeHazard === h ? '#1f8a4c' : 'rgba(255,255,255,0.7)', color: activeHazard === h ? '#fff' : '#475569', border: 'none', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{h}</button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <svg viewBox="0 0 600 650" style={{ width: '100%', height: '100%' }}>
          <rect width="600" height="650" fill="#f0f9ff" rx="20"/>
          <text x="70" y="380" fill="#94a3b8" fontSize="12" fontStyle="italic">Arabian Sea</text>
          <text x="440" y="380" fill="#94a3b8" fontSize="12" fontStyle="italic">Bay of Bengal</text>
          
          <path d="M210,130 L320,120 L350,190 L290,260 L230,240 L190,180 Z" fill={getFill('Telangana')} stroke="#ffffff" strokeWidth="2.5"/>
          <text x="250" y="185" fill="#334155" fontSize="13" fontWeight="800">TELANGANA</text>

          <path d="M320,120 L440,190 L410,360 L340,380 L310,290 L350,190 Z" fill={getFill('Andhra Pradesh')} stroke="#ffffff" strokeWidth="2.5"/>
          <text x="350" y="270" fill="#334155" fontSize="13" fontWeight="800">ANDHRA PRADESH</text>

          <path d="M260,370 L340,380 L360,540 L280,550 L240,430 Z" fill={getFill('Tamil Nadu')} stroke="#ffffff" strokeWidth="2.5"/>
          <text x="280" y="460" fill="#334155" fontSize="13" fontWeight="800">TAMIL NADU</text>

          <path d="M210,380 L255,370 L275,530 L240,540 Z" fill={getFill('Kerala')} stroke="#ffffff" strokeWidth="2.5"/>
          <text x="175" y="470" fill="#334155" fontSize="12" fontWeight="800">KERALA</text>
        </svg>

        <div style={{ position: 'absolute', top: '22%', left: '38%' }}>
          <div className="glass-callout" onClick={() => filtered[0] && onSelectAlert(filtered[0])} style={{ cursor: 'pointer' }}>
            <span style={{ height: '8px', width: '8px', background: '#d93025', borderRadius: '50%' }}></span>
            <span>🚨 Red · Flash Flood / Hyderabad</span>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '35%', left: '60%' }}>
          <div className="glass-callout" onClick={() => (filtered[1] || filtered[0]) && onSelectAlert(filtered[1] || filtered[0])} style={{ cursor: 'pointer' }}>
            <span style={{ height: '8px', width: '8px', background: '#f28c28', borderRadius: '50%' }}></span>
            <span>💨 75 km/h Winds / Vizag</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SouthIndiaHeroMap;
