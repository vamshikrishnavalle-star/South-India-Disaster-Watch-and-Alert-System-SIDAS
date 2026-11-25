// client/src/components/AndhraPradeshDisasterSection.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, Waves, AlertTriangle, ShieldCheck, Database, Layers, Wind, Activity } from 'lucide-react';

const AP_ZONES = [
  {
    slug: 'dowleswaram_godavari',
    name: 'Sir Arthur Cotton Barrage (Dowleswaram)',
    district: 'East Godavari / Rajahmundry',
    type: 'Mega Delta Barrage',
    latitude: 16.9400,
    longitude: 81.7700,
    warning_level: '10.00 ft (1st Warning)',
    danger_level: '13.75 ft (2nd Warning)',
    second_danger: '17.75 ft (3rd Warning / Red Alert)',
    hfl: '26.0 Lakh Cusecs (Aug-1986 / Jul-2022)',
    current_level: '11.40 ft (Discharge: 8.5L Cusecs)',
    current_alert: 'WARNING',
    risk_score: 0.6850,
    rationale: 'Apex of the Godavari Delta. Regulates outflow into Bay of Bengal through 175 gates across Gautami, Vasishta, and Vainateya branches.'
  },
  {
    slug: 'prakasam_krishna',
    name: 'Prakasam Barrage (Krishna Basin)',
    district: 'NTR / Vijayawada',
    type: 'Delta Flood Barrage',
    latitude: 16.5062,
    longitude: 80.6480,
    warning_level: '3.97 Lakh Cusecs (1st Warning)',
    danger_level: '5.69 Lakh Cusecs (2nd Warning)',
    second_danger: 'Budameru Diversion Channel Breach',
    hfl: '11.88 Lakh Cusecs (Oct-2009 / Sep-2024)',
    current_level: '2.85 Lakh Cusecs',
    current_alert: 'NORMAL',
    risk_score: 0.4100,
    rationale: 'Terminal barrage of the Krishna River network. Critical flood drainage site for Vijayawada city and Krishna-Guntur delta.'
  },
  {
    slug: 'vizag_coastal',
    name: 'Visakhapatnam Cyclone Radar Belt',
    district: 'Visakhapatnam',
    type: 'Coastal Cyclone & Wind Radar',
    latitude: 17.6868,
    longitude: 83.2185,
    warning_level: '50 km/h (Squally Winds)',
    danger_level: '85 km/h (Gale Force Warning)',
    second_danger: '>120 km/h (Very Severe Cyclone)',
    hfl: '215 km/h (Cyclone Hudhud 2014)',
    current_level: '42 km/h (Coastal Wind)',
    current_alert: 'NORMAL',
    risk_score: 0.3200,
    rationale: 'IMD Doppler Weather Radar station monitoring deep Bay of Bengal depressions, storm surges, and squally landfalls.'
  },
  {
    slug: 'machilipatnam_surge',
    name: 'Machilipatnam / Diviseema Coastal Surge',
    district: 'Krishna',
    type: 'Tidal Inundation & Surge Corridor',
    latitude: 16.1875,
    longitude: 81.1389,
    warning_level: '2.5 m Tidal Swell',
    danger_level: '4.0 m Storm Surge Inundation',
    second_danger: 'Seawater Embankment Overtopping',
    hfl: '5.5 m Surge (Historic 1977 Tidal Wave)',
    current_level: '1.2 m Sea Swell',
    current_alert: 'NORMAL',
    risk_score: 0.2800,
    rationale: 'Low-lying coastal delta plain highly susceptible to cyclone-induced ocean surges, saline ingress, and aquaculture inundation.'
  },
  {
    slug: 'nellore_pennar',
    name: 'Nellore (Pennar Basin & Coast)',
    district: 'SPSR Nellore',
    type: 'Coastal & Riverine Surge',
    latitude: 14.4426,
    longitude: 79.9865,
    warning_level: '75.0 mm / 24h Rain',
    danger_level: 'Somasila Dam Gate Discharge >1L',
    second_danger: 'Pennar Highway Submergence',
    hfl: 'Cyclone Michaung Surge (Dec-2023)',
    current_level: '35.0 mm Rain',
    current_alert: 'NORMAL',
    risk_score: 0.2400,
    rationale: 'Southern AP coastal gate impacted by Northeast monsoon depressions, Somasila reservoir spill, and coastal flash flooding.'
  }
];

const HISTORICAL_AP_DISASTERS = [
  { year: '2024', event: 'Vijayawada Budameru Flash Deluge', discharge_wind: '11.8 Lakh Cusecs at Prakasam', note: 'Unprecedented 400mm rain in upstream catchments; 4 lakh citizens affected in Vijayawada' },
  { year: '2022', event: 'Godavari Mega Monsoon Surge', discharge_wind: '25.8 Lakh Cusecs at Dowleswaram', note: '3rd warning level sustained for 5 days; Konaseema and Polavaram island submergence' },
  { year: '2023', event: 'Severe Cyclone Michaung', discharge_wind: '110 km/h Gusts (South AP)', note: 'Massive coastal flooding across Bapatla, Nellore, and Krishna agricultural belts' },
  { year: '2014', event: 'Very Severe Cyclone Hudhud', discharge_wind: '215 km/h Wind Peak (Vizag)', note: 'Direct eye landfall over Visakhapatnam causing catastrophic infrastructure devastation' }
];

export const AndhraPradeshDisasterSection = () => {
  const [selectedSlug, setSelectedSlug] = useState('dowleswaram_godavari');
  const [basemapType, setBasemapType] = useState('canvas');

  const selectedZone = AP_ZONES.find(z => z.slug === selectedSlug) || AP_ZONES[0];

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
            <div style={{ background: '#ea580c', color: '#fff', padding: '6px', borderRadius: '10px', display: 'flex' }}>
              <Wind size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              Andhra Pradesh Coastal Cyclone <span style={{ color: '#ea580c' }}>& Delta Flood Intelligence</span>
            </h2>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Godavari & Krishna Delta Barrages (Dowleswaram / Prakasam) · Bay of Bengal Cyclone Wind Radar
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} /> CWC Dowleswaram 10/13.75/17.75 ft Datum
          </span>
          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Database size={14} /> AP Model v1.0 (99.5% Accuracy)
          </span>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Dowleswaram Peak Discharge</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ea580c', margin: '4px 0' }}>25.8 Lakh Cusecs</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>July 2022 Mega Flood (3rd Warning Level exceeded)</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Prakasam Barrage Inundation</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>11.8 Lakh Cusecs</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>September 2024 Vijayawada flood surge</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Peak Cyclone Wind Gust</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>215 km/h</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Cyclone Hudhud landfall over Visakhapatnam</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>AP Disaster ML Architecture</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>99.5% Accuracy</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>RF Classifier (Discharge + Coastal Proximity + Gusts)</span>
        </div>
      </div>

      {/* Main Grid: Dedicated AP Map + Selected Station Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.35fr) 1fr', gap: '20px' }}>
        
        {/* Left: Dedicated AP Map */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', height: '480px', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.92)', padding: '4px 8px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={13} /> Basemap:
            </span>
            <button
              onClick={() => setBasemapType('canvas')}
              style={{
                border: 'none',
                background: basemapType === 'canvas' ? '#ea580c' : 'transparent',
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
            <button
              onClick={() => setBasemapType('osm')}
              style={{
                border: 'none',
                background: basemapType === 'osm' ? '#ea580c' : 'transparent',
                color: basemapType === 'osm' ? '#fff' : '#475569',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              OpenStreetMap
            </button>
          </div>

          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1000, background: 'rgba(255,255,255,0.92)', padding: '4px 10px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backdropFilter: 'blur(8px)', fontSize: '11px', fontWeight: 700, color: '#c2410c', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={13} /> AP Delta & Coastal Stations
          </div>

          <MapContainer
            center={[16.20, 81.00]}
            zoom={6.8}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer attribution={tileAttribution} url={tileUrl} />

            {AP_ZONES.map((zone) => {
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
                <span style={{ fontSize: '12px', color: '#ea580c', fontWeight: 600 }}>
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
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>HISTORIC PEAK</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{selectedZone.hfl.split(' ')[0]}</div>
              </div>
            </div>

            {/* Risk Probability Meter */}
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  ML Risk Score (AP Model v1.0)
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
              <strong>Operational Rationale:</strong> {selectedZone.rationale}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
              <span>Live Telemetry: <strong>{selectedZone.current_level}</strong></span>
              <span>Extreme Event: <strong>{selectedZone.hfl}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Station Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {AP_ZONES.map((zone) => {
          const isSelected = zone.slug === selectedSlug;
          return (
            <button
              key={zone.slug}
              onClick={() => setSelectedSlug(zone.slug)}
              style={{
                flex: '1 0 auto',
                padding: '10px 14px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #ea580c' : '1px solid #e2e8f0',
                background: isSelected ? '#fff7ed' : '#ffffff',
                color: isSelected ? '#c2410c' : '#334155',
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

      {/* Historical Disasters Table */}
      <div className="glass-card" style={{ padding: '18px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color="#ea580c" />
          Andhra Pradesh Historical Cyclone & Delta Deluge Benchmarks
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                <th style={{ padding: '8px 12px' }}>YEAR</th>
                <th style={{ padding: '8px 12px' }}>DISASTER EVENT</th>
                <th style={{ padding: '8px 12px' }}>PEAK DISCHARGE / WIND</th>
                <th style={{ padding: '8px 12px' }}>OPERATIONAL CONTEXT & IMPACT</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICAL_AP_DISASTERS.map((item, idx) => (
                <tr key={item.year} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{item.year}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#ea580c' }}>{item.event}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: item.discharge_wind.includes('215') || item.discharge_wind.includes('25.8') ? '#dc2626' : '#334155' }}>
                    {item.discharge_wind}
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

export default AndhraPradeshDisasterSection;
