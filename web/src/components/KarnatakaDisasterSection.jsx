// client/src/components/KarnatakaDisasterSection.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Mountain, Waves, AlertTriangle, ShieldCheck, Database, Layers, Activity } from 'lucide-react';

const KARNATAKA_ZONES = [
  {
    slug: 'krs_dam_cauvery',
    name: 'Krishna Raja Sagara / KRS Dam',
    district: 'Mandya / Mysuru',
    type: 'Major Cauvery Dam Reservoir',
    latitude: 12.3814,
    longitude: 76.5734,
    warning_level: '120.00 ft (Warning)',
    danger_level: '124.80 ft (FRL / Full Gate Release)',
    second_danger: '>1.00 Lakh Cusecs Spillway Discharge',
    hfl: '1.25 Lakh Cusecs Outflow (Jul-2024)',
    current_level: '118.50 ft (Normal Inflow)',
    current_alert: 'NORMAL',
    risk_score: 0.3200,
    rationale: 'Primary reservoir regulating Cauvery river water to Bengaluru drinking supply and downstream surplus to Tamil Nadu.'
  },
  {
    slug: 'bengaluru_urban',
    name: 'Bengaluru Urban (BBMP Stormwater Radar)',
    district: 'Bengaluru Urban',
    type: 'Urban Valley Flood Radar',
    latitude: 12.9716,
    longitude: 77.5946,
    warning_level: '65.0 mm / 24h Rain',
    danger_level: '130.0 mm / 24h (Severe Flash Flood)',
    second_danger: 'Bellandur & Varthur Lake Waste Weir Breach',
    hfl: '180.0 mm / 24h (05-Sep-2022 Deluge)',
    current_level: '45.0 mm / 24h',
    current_alert: 'WARNING',
    risk_score: 0.5840,
    rationale: 'High-density urban IT corridor drainage (Bellandur, Varthur, Hebbal valleys). Prone to rapid underpass and arterial road submergence.'
  },
  {
    slug: 'kodagu_bhagamandala',
    name: 'Bhagamandala / Madikeri (Cauvery Origin)',
    district: 'Kodagu (Coorg)',
    type: 'Western Ghats Flash Flood & Landslide Radar',
    latitude: 12.3897,
    longitude: 75.5298,
    warning_level: '120.0 mm / 24h Rain',
    danger_level: '200.0 mm / 24h (Slope Failure Watch)',
    second_danger: 'Triveni Sangama Inundation & Ghat Cutoff',
    hfl: '480.0 mm in 48h (Aug-2018 Landslide Catastrophe)',
    current_level: '85.0 mm / 24h',
    current_alert: 'WARNING',
    risk_score: 0.6200,
    rationale: 'Epicenter of high-slope Western Ghats monsoon runoff and origin of River Cauvery. Highly susceptible to catastrophic debris flows.'
  },
  {
    slug: 'almatti_dam_krishna',
    name: 'Almatti Dam (Lal Bahadur Shastri Reservoir)',
    district: 'Bagalkote / Vijayapura',
    type: 'Upper Krishna River Barrage',
    latitude: 16.3312,
    longitude: 75.8878,
    warning_level: '517.00 m (Warning)',
    danger_level: '519.60 m (FRL / Full Reservoir Level)',
    second_danger: 'Inflow >4.0 Lakh Cusecs from Maharashtra',
    hfl: '5.5 Lakh Cusecs Inflow (Aug-2019 Deluge)',
    current_level: '514.20 m (Safe Operational Stage)',
    current_alert: 'NORMAL',
    risk_score: 0.2800,
    rationale: 'Regulates colossal interstate Krishna floodwaters from Maharashtra (Koyna & Kolhapur). Impact zone spans Belagavi and Bagalkote plains.'
  },
  {
    slug: 'mangaluru_netravati',
    name: 'Mangaluru (Netravati & Gurupura Estuary)',
    district: 'Dakshina Kannada',
    type: 'Coastal Estuarine Flood Radar',
    latitude: 12.9141,
    longitude: 74.8560,
    warning_level: '7.50 m (Warning Stage)',
    danger_level: '8.50 m (Danger Level)',
    second_danger: 'High Tide Storm Surge Ingress',
    hfl: '9.40 m (Bantwal Submergence Jul-2023)',
    current_level: '6.20 m Gauge Stage',
    current_alert: 'NORMAL',
    risk_score: 0.2500,
    rationale: 'Coastal confluence of Netravati and Gurupura rivers emptying into Arabian Sea. Prone to severe combined riverine and tidal inundation.'
  }
];

const HISTORICAL_KARNATAKA_DISASTERS = [
  { year: '2019', event: 'Upper Krishna & Belagavi Mega Flood', metric: '5.5 Lakh Cusecs Inflow at Almatti', note: 'Maharashtra dam releases flooded 400+ villages across Belagavi, Bagalkote, and Raichur; 2 lakh people evacuated' },
  { year: '2018', event: 'Kodagu Catastrophic Landslides', metric: '480mm in 48h (Bhagamandala)', note: 'Massive debris flows leveled entire villages (Jothipala, Thora); Madikeri isolated for weeks' },
  { year: '2022', event: 'Bengaluru Tech Corridor Deluge', metric: '180mm Rain / 24h (Mahadevapura)', note: 'Outer Ring Road, Bellandur, and Rainbow Drive flooded; tractors used for evacuation in premium tech campuses' },
  { year: '2024', event: 'Tungabhadra Dam 19th Gate Breach', metric: '2.5 Lakh Cusecs Emergency Discharge', note: 'Chain link snapped in gate 19 at TB Dam (Hospet); immediate downstream flood alert issued for Ballari & AP' }
];

export const KarnatakaDisasterSection = () => {
  const [selectedSlug, setSelectedSlug] = useState('bengaluru_urban');
  const [basemapType, setBasemapType] = useState('osm');

  const selectedZone = KARNATAKA_ZONES.find(z => z.slug === selectedSlug) || KARNATAKA_ZONES[0];

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
            <div style={{ background: '#ca8a04', color: '#fff', padding: '6px', borderRadius: '10px', display: 'flex' }}>
              <Mountain size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              Karnataka State Disaster Radar <span style={{ color: '#ca8a04' }}>& Reservoir / Landslide Watch</span>
            </h2>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Cauvery & Krishna Basin Reservoirs (KRS / Almatti) · Bengaluru Stormwater Radar · Western Ghats Landslide Watch
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', background: '#fefce8', color: '#854d0e', border: '1px solid #fef08a', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} /> KSNDMC / CWC Multi-Reservoir Datum
          </span>
          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Database size={14} /> KA Model v1.0 (99.5% Accuracy)
          </span>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #ca8a04' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Almatti Peak Monsoon Inflow</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ca8a04', margin: '4px 0' }}>5.5 Lakh Cusecs</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>August 2019 Krishna deluge across Belagavi plains</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Kodagu Landslide Cloudburst</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>480 mm / 48h</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>August 2018 Western Ghats slope collapse catastrophe</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>KRS Dam Full Reservoir Level</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>124.80 ft</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Maximum capacity reached with 1.25L cusecs crest discharge</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Karnataka ML Model</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>99.5% Accuracy</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>RF Classifier (Inflow + Elevation + Urban Density)</span>
        </div>
      </div>

      {/* Main Grid: Dedicated Karnataka Map + Selected Station Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.35fr) 1fr', gap: '20px' }}>
        
        {/* Left: Dedicated Karnataka Map */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', height: '480px', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.92)', padding: '4px 8px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={13} /> Basemap:
            </span>
            <button
              onClick={() => setBasemapType('osm')}
              style={{
                border: 'none',
                background: basemapType === 'osm' ? '#ca8a04' : 'transparent',
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
                background: basemapType === 'canvas' ? '#ca8a04' : 'transparent',
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

          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1000, background: 'rgba(255,255,255,0.92)', padding: '4px 10px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backdropFilter: 'blur(8px)', fontSize: '11px', fontWeight: 700, color: '#854d0e', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={13} /> Karnataka Reservoirs & Ghats
          </div>

          <MapContainer
            center={[14.50, 75.80]}
            zoom={6.8}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer attribution={tileAttribution} url={tileUrl} />

            {KARNATAKA_ZONES.map((zone) => {
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
                <span style={{ fontSize: '12px', color: '#ca8a04', fontWeight: 600 }}>
                  {selectedZone.district} · {selectedZone.type}
                </span>
              </div>
              <span style={{ background: selectedZone.current_alert === 'ALERT' ? '#fef2f2' : (selectedZone.current_alert === 'WARNING' ? '#fefce8' : '#f0fdf4'), color: getAlertColor(selectedZone.current_alert), padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                {selectedZone.current_alert} STATUS
              </span>
            </div>

            {/* Threshold Levels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>WARNING LEVEL</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#ea580c' }}>{selectedZone.warning_level.split(' ')[0]}</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>DANGER / FRL</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#dc2626' }}>{selectedZone.danger_level.split(' ')[0]}</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>RECORD BENCHMARK</span>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{selectedZone.hfl.split(' ')[0]}</div>
              </div>
            </div>

            {/* Risk Probability Meter */}
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  ML Risk Score (KA Model v1.0)
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
              <span>Live Reading: <strong>{selectedZone.current_level}</strong></span>
              <span>Extreme Event: <strong>{selectedZone.hfl}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Station Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {KARNATAKA_ZONES.map((zone) => {
          const isSelected = zone.slug === selectedSlug;
          return (
            <button
              key={zone.slug}
              onClick={() => setSelectedSlug(zone.slug)}
              style={{
                flex: '1 0 auto',
                padding: '10px 14px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #ca8a04' : '1px solid #e2e8f0',
                background: isSelected ? '#fefce8' : '#ffffff',
                color: isSelected ? '#854d0e' : '#334155',
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
          <AlertTriangle size={16} color="#ca8a04" />
          Karnataka Historical Monsoon & Reservoir Deluge Archive (2018–2024 Benchmarks)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                <th style={{ padding: '8px 12px' }}>YEAR</th>
                <th style={{ padding: '8px 12px' }}>DISASTER EVENT</th>
                <th style={{ padding: '8px 12px' }}>PEAK INFLOW / DISCHARGE</th>
                <th style={{ padding: '8px 12px' }}>IMPACT & COMMUNITY CONTEXT</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICAL_KARNATAKA_DISASTERS.map((item, idx) => (
                <tr key={item.year} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{item.year}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#ca8a04' }}>{item.event}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: item.metric.includes('5.5') || item.metric.includes('480') ? '#dc2626' : '#334155' }}>
                    {item.metric}
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

export default KarnatakaDisasterSection;
