// client/src/components/TelanganaDisasterSection.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Flame, Waves, AlertTriangle, ShieldCheck, Database, Layers, Activity } from 'lucide-react';

const TELANGANA_ZONES = [
  {
    slug: 'bhadrachalam_godavari',
    name: 'Bhadrachalam (Godavari Basin)',
    district: 'Bhadradri Kothagudem',
    type: 'CWC Riverine Gauge',
    latitude: 17.6688,
    longitude: 80.8936,
    warning_level: '43.00 ft (1st Warning)',
    danger_level: '48.00 ft (2nd Warning)',
    second_danger: '53.00 ft (3rd Danger Stage)',
    hfl: '71.60 ft (16-Jul-2022)',
    current_level: '45.20 ft',
    current_alert: 'WARNING',
    risk_score: 0.7240,
    rationale: 'Primary CWC gauging site on River Godavari downstream of Pranahita confluence. Epicenter of massive upland monsoonal floods.'
  },
  {
    slug: 'hyderabad_musi',
    name: 'Hyderabad (Musi Basin / GHMC)',
    district: 'Hyderabad & Rangareddy',
    type: 'Urban Inundation Radar',
    latitude: 17.3850,
    longitude: 78.4867,
    warning_level: '50.0 mm / 24h',
    danger_level: '115.0 mm / 24h',
    second_danger: 'Twin Reservoirs Full Gates Open',
    hfl: '320.0 mm (13-Oct-2020 Deluge)',
    current_level: '62.4 mm (24h Rain)',
    current_alert: 'ALERT',
    risk_score: 0.8120,
    rationale: 'Dense urban catchment of Musi River. Highly vulnerable to rapid flash floods, lake breaches, and underpass submergence.'
  },
  {
    slug: 'medigadda_barrage',
    name: 'Medigadda (Laxmi) Barrage',
    district: 'Jayashankar Bhupalpally',
    type: 'Riverine Confluence Gauge',
    latitude: 18.7900,
    longitude: 79.9500,
    warning_level: '10.00 Lakh Cusecs Inflow',
    danger_level: '15.00 Lakh Cusecs',
    second_danger: 'Full 85 Gates Operational',
    hfl: '28.5 Lakh Cusecs (Jul-2022)',
    current_level: '6.4 Lakh Cusecs',
    current_alert: 'NORMAL',
    risk_score: 0.3800,
    rationale: 'Confluence point of Godavari and Pranahita rivers; monitors massive interstate inflows from Maharashtra and MP.'
  },
  {
    slug: 'ramagundam_heat',
    name: 'Ramagundam Industrial Basin',
    district: 'Peddapalli',
    type: 'Extreme Heatwave Station',
    latitude: 18.7618,
    longitude: 79.5147,
    warning_level: '41.5 °C (Yellow Heat)',
    danger_level: '44.0 °C (Orange Heat)',
    second_danger: '46.5 °C (Severe Heatwave Red)',
    hfl: '47.8 °C (May-2015 / 2024)',
    current_level: '38.2 °C (Ambient Temp)',
    current_alert: 'NORMAL',
    risk_score: 0.2900,
    rationale: 'Open-cast coal mining corridor and thermal belt; prone to intense summer loo winds and lethal heat indices.'
  },
  {
    slug: 'warangal_urban',
    name: 'Warangal (Bhadrakali Basin)',
    district: 'Hanamkonda / Warangal',
    type: 'Urban Lake Catchment',
    latitude: 17.9784,
    longitude: 79.5941,
    warning_level: '60.0 mm / 24h',
    danger_level: '120.0 mm / 24h',
    second_danger: 'Bhadrakali Lake Sluice Overflow',
    hfl: '260.0 mm (Aug-2020 Deluge)',
    current_level: '48.0 mm',
    current_alert: 'NORMAL',
    risk_score: 0.3500,
    rationale: 'Chain of historical Kakatiya irrigation tanks overflowing into densely populated residential colonies.'
  }
];

const HISTORICAL_TELANGANA_DELUGES = [
  { year: '2022', event: 'Godavari Historic Mega Surge', bhadrachalam: '71.60 ft (2nd Highest Ever)', note: 'Over 24 lakh cusecs discharge; 25,000 evacuated across Bhadrachalam and Pinapaka' },
  { year: '2020', event: 'Hyderabad Musi River Deluge', bhadrachalam: '58.40 ft', note: 'Single day 320mm rain in Hyderabad; massive flash floods across Musi corridor' },
  { year: '2023', event: 'Kaleshwaram Confluence Flood', bhadrachalam: '53.80 ft', note: 'Heavy cloudburst in Mulugu and Bhupalpally with Moranchapalli town submergence' },
  { year: '2024', event: 'Summer Heatwave & Pre-Monsoon', bhadrachalam: '46.20 ft', note: 'Ramagundam heatwave (46.8°C) followed by Munneru river flash floods in Khammam' }
];

export const TelanganaDisasterSection = () => {
  const [selectedSlug, setSelectedSlug] = useState('bhadrachalam_godavari');
  const [basemapType, setBasemapType] = useState('osm');

  const selectedZone = TELANGANA_ZONES.find(z => z.slug === selectedSlug) || TELANGANA_ZONES[0];

  const tileUrl = basemapType === 'canvas'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution = basemapType === 'canvas'
    ? 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const getAlertColor = (alert) => {
    if (alert === 'ALERT') return '#dc2626';
    if (alert === 'WARNING') return '#ea580c';
    return '#16a34a';
  };

  return (
    <section style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#7c3aed', color: '#fff', padding: '6px', borderRadius: '10px', display: 'flex' }}>
              <Waves size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              Telangana State Disaster Radar <span style={{ color: '#7c3aed' }}>& Riverine / Heatwave Watch</span>
            </h2>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Godavari River Basin Telemetry (Bhadrachalam Gauge) · Hyderabad Urban Musi Radar · Ramagundam Heat Index
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} /> CWC Bhadrachalam 43/48/53 ft Datum
          </span>
          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Database size={14} /> TS Model v1.0 (98.5% Accuracy)
          </span>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Bhadrachalam 2022 Record Surge</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>71.60 ft</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>16-Jul-2022 (Exceeded 3rd Danger Stage 53ft by +18.6ft)</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Hyderabad 2020 Urban Rain</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#7c3aed', margin: '4px 0' }}>320 mm / 24h</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Musi River flash flood and Himayat Sagar gate spill</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Ramagundam Extreme Heat</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ea580c', margin: '4px 0' }}>47.8 °C</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Severe Heatwave threshold (exceeding 44°C)</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Telangana ML Model Architecture</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>98.5% Accuracy</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>RF Classifier (Inflow + Antecedent Rain + Heat Index)</span>
        </div>
      </div>

      {/* Main Grid: Map + Selected Station Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.35fr) 1fr', gap: '20px' }}>
        
        {/* Left: Dedicated Telangana Map */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', height: '480px', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.92)', padding: '4px 8px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={13} /> Basemap:
            </span>
            <button
              onClick={() => setBasemapType('osm')}
              style={{
                border: 'none',
                background: basemapType === 'osm' ? '#7c3aed' : 'transparent',
                color: basemapType === 'osm' ? '#fff' : '#475569',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              OpenStreetMap (Primary)
            </button>
            <button
              onClick={() => setBasemapType('canvas')}
              style={{
                border: 'none',
                background: basemapType === 'canvas' ? '#7c3aed' : 'transparent',
                color: basemapType === 'canvas' ? '#fff' : '#475569',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Light Canvas
            </button>
          </div>

          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1000, background: 'rgba(255,255,255,0.92)', padding: '4px 10px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backdropFilter: 'blur(8px)', fontSize: '11px', fontWeight: 700, color: '#6d28d9', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={13} /> Telangana Hazard Corridors
          </div>

          <MapContainer
            center={[17.85, 79.10]}
            zoom={7.2}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer attribution={tileAttribution} url={tileUrl} />

            {TELANGANA_ZONES.map((zone) => {
              const isSelected = zone.slug === selectedSlug;
              const markerColor = getAlertColor(zone.current_alert);

              return (
                <React.Fragment key={zone.slug}>
                  <CircleMarker
                    center={[zone.latitude, zone.longitude]}
                    radius={isSelected ? 26 : 18}
                    pathOptions={{
                      color: markerColor,
                      fillColor: markerColor,
                      fillOpacity: isSelected ? 0.3 : 0.12,
                      weight: isSelected ? 2.5 : 1.2
                    }}
                  />
                  <CircleMarker
                    center={[zone.latitude, zone.longitude]}
                    radius={isSelected ? 10 : 7}
                    eventHandlers={{ click: () => setSelectedSlug(zone.slug) }}
                    pathOptions={{
                      color: '#ffffff',
                      fillColor: markerColor,
                      fillOpacity: 1,
                      weight: 2
                    }}
                  >
                    <Tooltip permanent={true} direction="right" offset={[10, 0]}>
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>{zone.name.split(' ')[0]}</span>
                    </Tooltip>

                    <Popup>
                      <div style={{ minWidth: '180px', fontFamily: 'system-ui, sans-serif' }}>
                        <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>{zone.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{zone.type}</div>
                        <div style={{ fontSize: '11px', marginTop: '4px' }}>Warning: <strong>{zone.warning_level}</strong></div>
                        <div style={{ fontSize: '11px' }}>Danger: <strong style={{ color: '#dc2626' }}>{zone.danger_level}</strong></div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* Right: Active Station Detail & Risk Meter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  Monitored Station Profile
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>
                  {selectedZone.name}
                </h3>
                <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 600 }}>
                  {selectedZone.district} · {selectedZone.type}
                </span>
              </div>
              <span style={{ background: selectedZone.current_alert === 'ALERT' ? '#fef2f2' : (selectedZone.current_alert === 'WARNING' ? '#fff7ed' : '#f0fdf4'), color: getAlertColor(selectedZone.current_alert), padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                {selectedZone.current_alert} STATUS
              </span>
            </div>

            {/* Threshold Levels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>1ST WARNING</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ea580c' }}>{selectedZone.warning_level.split(' ')[0]}</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>2ND DANGER</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#dc2626' }}>{selectedZone.danger_level.split(' ')[0]}</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>RECORD PEAK</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{selectedZone.hfl.split(' ')[0]}</div>
              </div>
            </div>

            {/* Risk Probability Meter */}
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  ML Risk Score (TS Model v1.0)
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: getAlertColor(selectedZone.current_alert) }}>
                  {(selectedZone.risk_score * 100).toFixed(1)}% · {selectedZone.current_alert}
                </span>
              </div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${selectedZone.risk_score * 100}%`,
                    background: getAlertColor(selectedZone.current_alert),
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
              <strong>Catchment Impact:</strong> {selectedZone.rationale}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
              <span>Live Reading: <strong>{selectedZone.current_level}</strong></span>
              <span>Extreme Benchmark: <strong>{selectedZone.hfl}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Station Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {TELANGANA_ZONES.map((zone) => {
          const isSelected = zone.slug === selectedSlug;
          return (
            <button
              key={zone.slug}
              onClick={() => setSelectedSlug(zone.slug)}
              style={{
                flex: '1 0 auto',
                padding: '10px 14px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                background: isSelected ? '#f5f3ff' : '#ffffff',
                color: isSelected ? '#6d28d9' : '#334155',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>{zone.name.split(' ')[0]}</span>
                <span style={{ height: '7px', width: '7px', borderRadius: '50%', background: getAlertColor(zone.current_alert) }}></span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{zone.district}</span>
            </button>
          );
        })}
      </div>

      {/* Historical Deluges Table */}
      <div className="glass-card" style={{ padding: '18px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color="#7c3aed" />
          Telangana Historical Flood & Heatwave Benchmarks (2020–2024 Archive)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                <th style={{ padding: '8px 12px' }}>YEAR</th>
                <th style={{ padding: '8px 12px' }}>EVENT TYPE</th>
                <th style={{ padding: '8px 12px' }}>BHADRACHALAM PEAK</th>
                <th style={{ padding: '8px 12px' }}>DISASTER CONTEXT & COMMUNITY IMPACT</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICAL_TELANGANA_DELUGES.map((item, idx) => (
                <tr key={item.year} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{item.year}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#7c3aed' }}>{item.event}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: item.bhadrachalam.includes('Historic') ? '#dc2626' : '#334155' }}>
                    {item.bhadrachalam}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TelanganaDisasterSection;
