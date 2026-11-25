import React, { useState } from 'react';

const SouthIndiaHeroMap = ({ alerts = [], stateSeverities = {}, onSelectAlert }) => {
  const [activeHazard, setActiveHazard] = useState('All');
  const [hoveredState, setHoveredState] = useState(null);

  const getSeverity = (st) => stateSeverities[st] || 'Green';

  const getFill = (st) => {
    const s = getSeverity(st);
    if (s === 'Red') return hoveredState === st ? '#fca5a5' : '#fee2e2';
    if (s === 'Orange') return hoveredState === st ? '#fdba74' : '#ffedd5';
    if (s === 'Yellow') return hoveredState === st ? '#fde047' : '#fef9c3';
    return hoveredState === st ? '#bbf7d0' : '#f0fdf4';
  };

  const getStroke = (st) => {
    const s = getSeverity(st);
    if (s === 'Red') return '#dc2626';
    if (s === 'Orange') return '#ea580c';
    if (s === 'Yellow') return '#ca8a04';
    return '#16a34a';
  };

  const filtered = alerts.filter(a => activeHazard === 'All' || a.hazard === activeHazard);

  return (
    <div className="glass-card" style={{ position: 'relative', height: '540px', overflow: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, position: 'relative', marginBottom: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>South India Risk Map</h3>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Live Geospatial Hazard Radar · Click state or pulse beacon to inspect</span>
        </div>
        <div style={{ display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.7)', padding: '3px', borderRadius: '999px', border: '1px solid #e2e8f0' }}>
          {['All', 'Flood', 'Cyclone', 'Heatwave', 'Landslide'].map(h => (
            <button
              key={h}
              onClick={() => setActiveHazard(h)}
              style={{
                background: activeHazard === h ? '#1f8a4c' : 'transparent',
                color: activeHazard === h ? '#fff' : '#475569',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: '100%', position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          viewBox="0 0 620 660"
          style={{ width: '100%', height: '100%', maxHeight: '480px', filter: 'drop-shadow(0 10px 25px rgba(15,23,42,0.08))' }}
        >
          <defs>
            {/* Ocean gradient background */}
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </radialGradient>

            {/* Glowing filter for pulses */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background card with subtle sea styling */}
          <rect width="620" height="660" fill="url(#oceanGrad)" rx="24" />

          {/* Grid lines and geographic annotations */}
          <path d="M 50,150 L 570,150 M 50,300 L 570,300 M 50,450 L 570,450" stroke="#0284c7" strokeWidth="0.5" strokeDasharray="3,6" opacity="0.15" />
          <path d="M 200,50 L 200,610 M 350,50 L 350,610 M 500,50 L 500,610" stroke="#0284c7" strokeWidth="0.5" strokeDasharray="3,6" opacity="0.15" />

          <text x="60" y="320" fill="#0284c7" fontSize="13" fontStyle="italic" fontWeight="600" opacity="0.35">ARABIAN SEA</text>
          <text x="440" y="320" fill="#0284c7" fontSize="13" fontStyle="italic" fontWeight="600" opacity="0.35">BAY OF BENGAL</text>
          <text x="240" y="635" fill="#0284c7" fontSize="12" fontStyle="italic" fontWeight="600" opacity="0.35">INDIAN OCEAN</text>

          {/* 1. KARNATAKA (Interactive region with Western Ghats & Deccan plateau geometry) */}
          <path
            d="M 215,70 
               C 210,95 200,120 190,145 
               C 165,180 140,220 145,260 
               C 150,290 160,330 170,360 
               L 190,385 
               C 210,380 230,375 240,365 
               C 255,340 260,310 255,275 
               C 250,240 260,205 250,170 
               C 240,135 235,100 215,70 Z"
            fill={getFill('Karnataka')}
            stroke={getStroke('Karnataka')}
            strokeWidth={hoveredState === 'Karnataka' ? '3' : '2'}
            onMouseEnter={() => setHoveredState('Karnataka')}
            onMouseLeave={() => setHoveredState(null)}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          />
          <text x="200" y="240" fill="#1e293b" fontSize="13" fontWeight="800" textAnchor="middle" pointerEvents="none">
            KARNATAKA
          </text>
          <text x="200" y="255" fill={getStroke('Karnataka')} fontSize="10" fontWeight="700" textAnchor="middle" pointerEvents="none">
            {getSeverity('Karnataka').toUpperCase()} ALERT
          </text>

          {/* 2. TELANGANA (Seamless border with Karnataka west, AP south & east, MH north) */}
          <path
            d="M 215,70 
               C 235,50 265,40 295,45 
               C 335,50 365,75 375,105 
               C 380,125 365,150 350,170 
               C 325,195 295,205 270,210 
               C 255,200 250,185 250,170 
               C 240,135 235,100 215,70 Z"
            fill={getFill('Telangana')}
            stroke={getStroke('Telangana')}
            strokeWidth={hoveredState === 'Telangana' ? '3' : '2'}
            onMouseEnter={() => setHoveredState('Telangana')}
            onMouseLeave={() => setHoveredState(null)}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          />
          <text x="275" y="115" fill="#1e293b" fontSize="13" fontWeight="800" textAnchor="middle" pointerEvents="none">
            TELANGANA
          </text>
          <text x="275" y="130" fill={getStroke('Telangana')} fontSize="10" fontWeight="700" textAnchor="middle" pointerEvents="none">
            {getSeverity('Telangana').toUpperCase()} ALERT
          </text>

          {/* 3. ANDHRA PRADESH (Crescent coastal arc from Srikakulam/Vizag down to Nellore, wrapping Telangana) */}
          <path
            d="M 375,105 
               C 410,85 450,80 475,95 
               C 495,110 470,140 450,165 
               C 425,195 410,225 395,260 
               C 375,305 360,355 350,400 
               L 330,395 
               C 310,380 280,375 255,365 
               C 260,335 260,305 255,275 
               C 260,240 265,225 270,210 
               C 295,205 325,195 350,170 
               C 365,150 380,125 375,105 Z"
            fill={getFill('Andhra Pradesh')}
            stroke={getStroke('Andhra Pradesh')}
            strokeWidth={hoveredState === 'Andhra Pradesh' ? '3' : '2'}
            onMouseEnter={() => setHoveredState('Andhra Pradesh')}
            onMouseLeave={() => setHoveredState(null)}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          />
          <text x="355" y="240" fill="#1e293b" fontSize="13" fontWeight="800" textAnchor="middle" pointerEvents="none">
            ANDHRA PRADESH
          </text>
          <text x="355" y="255" fill={getStroke('Andhra Pradesh')} fontSize="10" fontWeight="700" textAnchor="middle" pointerEvents="none">
            {getSeverity('Andhra Pradesh').toUpperCase()} WATCH
          </text>

          {/* 4. TAMIL NADU (Southern triangular peninsula, Coromandel coast, Cape Comorin) */}
          <path
            d="M 330,395 
               C 345,410 355,435 350,465 
               C 345,495 350,525 340,555 
               C 325,585 305,610 285,630 
               C 275,615 265,585 260,550 
               C 255,510 250,470 240,430 
               C 235,405 215,395 190,385 
               C 210,380 230,375 240,365 
               C 265,370 295,385 330,395 Z"
            fill={getFill('Tamil Nadu')}
            stroke={getStroke('Tamil Nadu')}
            strokeWidth={hoveredState === 'Tamil Nadu' ? '3' : '2'}
            onMouseEnter={() => setHoveredState('Tamil Nadu')}
            onMouseLeave={() => setHoveredState(null)}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          />
          <text x="295" y="475" fill="#1e293b" fontSize="13" fontWeight="800" textAnchor="middle" pointerEvents="none">
            TAMIL NADU
          </text>
          <text x="295" y="490" fill={getStroke('Tamil Nadu')} fontSize="10" fontWeight="700" textAnchor="middle" pointerEvents="none">
            {getSeverity('Tamil Nadu').toUpperCase()} ALERT
          </text>

          {/* 5. KERALA (Slender southwestern coastal belt along Western Ghats from Kasaragod to Thiruvananthapuram) */}
          <path
            d="M 170,360 
               C 178,380 185,400 190,420 
               C 200,455 210,490 220,525 
               C 235,565 255,605 285,630 
               C 270,610 260,570 255,530 
               C 250,490 240,450 230,420 
               C 220,395 205,385 190,385 
               L 170,360 Z"
            fill={getFill('Kerala')}
            stroke={getStroke('Kerala')}
            strokeWidth={hoveredState === 'Kerala' ? '3' : '2'}
            onMouseEnter={() => setHoveredState('Kerala')}
            onMouseLeave={() => setHoveredState(null)}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          />
          <text x="200" y="520" fill="#1e293b" fontSize="12" fontWeight="800" textAnchor="middle" pointerEvents="none">
            KERALA
          </text>
          <text x="200" y="534" fill={getStroke('Kerala')} fontSize="9" fontWeight="700" textAnchor="middle" pointerEvents="none">
            {getSeverity('Kerala').toUpperCase()} ALERT
          </text>

          {/* Animated Pulse Beacons & Floating Badges */}
          {/* Hyderabad Pin (Telangana) */}
          <g transform="translate(285, 150)">
            <circle r="12" fill="#dc2626" opacity="0.25">
              <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Vizag Pin (Andhra Pradesh) */}
          <g transform="translate(445, 135)">
            <circle r="12" fill="#ea580c" opacity="0.25">
              <animate attributeName="r" values="6;16;6" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Wayanad / Kerala Pin */}
          <g transform="translate(195, 410)">
            <circle r="12" fill="#dc2626" opacity="0.25">
              <animate attributeName="r" values="6;16;6" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Chennai Pin (Tamil Nadu) */}
          <g transform="translate(345, 405)">
            <circle r="10" fill="#ca8a04" opacity="0.25">
              <animate attributeName="r" values="5;14;5" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle r="4.5" fill="#ca8a04" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Bengaluru Pin (Karnataka) */}
          <g transform="translate(215, 320)">
            <circle r="11" fill="#ca8a04" opacity="0.25">
              <animate attributeName="r" values="5;15;5" dur="2.1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.1s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill="#ca8a04" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Floating Glass Callouts Positioned Accurately over Pins */}
        <div style={{ position: 'absolute', top: '46%', left: '15%', zIndex: 10 }}>
          <div
            className="glass-callout"
            onClick={() => {
              const a = filtered.find(x => x.state === 'Karnataka') || filtered[0];
              if (a) onSelectAlert(a);
            }}
            style={{ cursor: 'pointer', borderLeft: '4px solid #ca8a04' }}
          >
            <span style={{ height: '8px', width: '8px', background: '#ca8a04', borderRadius: '50%', boxShadow: '0 0 8px #ca8a04' }}></span>
            <span>⚠️ Yellow · Urban Runoff / Bengaluru</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '16%', left: '38%', zIndex: 10 }}>
          <div
            className="glass-callout"
            onClick={() => {
              const a = filtered.find(x => x.state === 'Telangana') || filtered[0];
              if (a) onSelectAlert(a);
            }}
            style={{ cursor: 'pointer', borderLeft: '4px solid #dc2626' }}
          >
            <span style={{ height: '8px', width: '8px', background: '#dc2626', borderRadius: '50%', boxShadow: '0 0 8px #dc2626' }}></span>
            <span>🚨 Red · Flash Flood / Hyderabad</span>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '23%', right: '8%', zIndex: 10 }}>
          <div
            className="glass-callout"
            onClick={() => {
              const a = filtered.find(x => x.state === 'Andhra Pradesh') || filtered[1] || filtered[0];
              if (a) onSelectAlert(a);
            }}
            style={{ cursor: 'pointer', borderLeft: '4px solid #ea580c' }}
          >
            <span style={{ height: '8px', width: '8px', background: '#ea580c', borderRadius: '50%', boxShadow: '0 0 8px #ea580c' }}></span>
            <span>💨 75 km/h Winds / Vizag</span>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '26%', left: '10%', zIndex: 10 }}>
          <div
            className="glass-callout"
            onClick={() => {
              const a = filtered.find(x => x.hazard === 'Landslide' || x.state === 'Kerala') || filtered[0];
              if (a) onSelectAlert(a);
            }}
            style={{ cursor: 'pointer', borderLeft: '4px solid #dc2626' }}
          >
            <span style={{ height: '8px', width: '8px', background: '#dc2626', borderRadius: '50%', boxShadow: '0 0 8px #dc2626' }}></span>
            <span>⚠️ Red · Landslide / Wayanad</span>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '34%', right: '18%', zIndex: 10 }}>
          <div
            className="glass-callout"
            onClick={() => {
              const a = filtered.find(x => x.state === 'Tamil Nadu') || filtered[0];
              if (a) onSelectAlert(a);
            }}
            style={{ cursor: 'pointer', borderLeft: '4px solid #ca8a04' }}
          >
            <span style={{ height: '8px', width: '8px', background: '#ca8a04', borderRadius: '50%', boxShadow: '0 0 8px #ca8a04' }}></span>
            <span>🌧️ Moderate Flood / Chennai</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SouthIndiaHeroMap;
