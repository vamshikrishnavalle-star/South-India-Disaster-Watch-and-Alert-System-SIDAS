// client/src/components/KeralaFloodBasinSection.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Waves, AlertTriangle, ShieldCheck, Database, Layers, ArrowUpRight, Activity } from 'lucide-react';

const KERALA_ZONES = [
  {
    slug: 'pathanamthitta_kozhencherry',
    name: 'Kallooppara (Pamba Basin)',
    district: 'Pathanamthitta',
    station_code: '017-SWRDKOCHI',
    river_basin: 'Pamba',
    latitude: 9.3364,
    longitude: 76.6974,
    status: 'validated',
    danger_level: '6.00 m',
    warning_level: '5.00 m',
    hfl: '9.64 m (16-Aug-2018)',
    danger_exceedances: 116,
    warning_exceedances: 246,
    monitored_days: 9010,
    hydrological_type: 'Midland Riverine',
    rationale: 'Key Pamba River gauge station; epicenter of extreme upland runoff and 2018 flash flooding with 9.64m HFL.',
    current_risk_score: 0.8840,
    current_alert: 'ALERT'
  },
  {
    slug: 'kottayam_pala',
    name: 'Kidangoor (Meenachil Basin)',
    district: 'Kottayam',
    station_code: '015-SWRDKOCHI',
    river_basin: 'Meenachil',
    latitude: 9.7100,
    longitude: 76.6800,
    status: 'validated',
    danger_level: '7.16 m',
    warning_level: '6.16 m',
    hfl: '8.24 m (09-Aug-2020)',
    danger_exceedances: 14,
    warning_exceedances: 42,
    monitored_days: 3253,
    hydrological_type: 'Midland Riverine',
    rationale: 'Meenachil river valley gauge; prone to rapid flash inundation during heavy eastern ghat hill precipitation.',
    current_risk_score: 0.6420,
    current_alert: 'WARNING'
  },
  {
    slug: 'ernakulam_aluva',
    name: 'Aluva (Periyar Basin)',
    district: 'Ernakulam',
    station_code: 'PERIYAR-ALUVA',
    river_basin: 'Periyar',
    latitude: 10.1076,
    longitude: 76.3516,
    status: 'provisional',
    danger_level: '3.50 m (local)',
    warning_level: '2.80 m',
    hfl: '4.95 m (Aug-2018)',
    danger_exceedances: 18,
    warning_exceedances: 34,
    monitored_days: 2800,
    hydrological_type: 'Midland Riverine / Estuarine',
    rationale: 'Periyar River corridor; key gauge station and 2018 flood epicenter severely affected by upstream dam discharges.',
    current_risk_score: 0.7310,
    current_alert: 'ALERT'
  },
  {
    slug: 'idukki_cheruthoni',
    name: 'Cheruthoni (Idukki Catchment)',
    district: 'Idukki',
    station_code: '016-SWRDKOCHI (Vandiperiyar)',
    river_basin: 'Periyar Catchment',
    latitude: 9.8494,
    longitude: 76.9814,
    status: 'weather_only',
    danger_level: 'Spillway Gate Level',
    warning_level: 'Blue / Orange Stage',
    hfl: '2403.00 ft (Reservoir)',
    danger_exceedances: 8,
    warning_exceedances: 21,
    monitored_days: 2500,
    hydrological_type: 'High Relief Dam Catchment',
    rationale: 'Highland catchment directly downstream of Idukki Dam; high-slope runoff and catastrophic gate discharge impact.',
    current_risk_score: 0.4200,
    current_alert: 'NORMAL'
  },
  {
    slug: 'thrissur_chalakudy',
    name: 'Chalakudy (Chalakudy Basin)',
    district: 'Thrissur',
    station_code: 'CHALAKUDY-CORR',
    river_basin: 'Chalakudy',
    latitude: 10.3070,
    longitude: 76.3330,
    status: 'provisional',
    danger_level: '7.50 m',
    warning_level: '6.50 m',
    hfl: '9.10 m (Aug-2018)',
    danger_exceedances: 12,
    warning_exceedances: 29,
    monitored_days: 2200,
    hydrological_type: 'Midland Riverine',
    rationale: 'Chalakudy River basin; severely impacted by Sholayar and Poringalkuthu dam discharges during intense monsoons.',
    current_risk_score: 0.5890,
    current_alert: 'WARNING'
  },
  {
    slug: 'alappuzha_kuttanad',
    name: 'Kuttanad (Vembanad Basin)',
    district: 'Alappuzha',
    station_code: 'KUTTANAD-DELTA',
    river_basin: 'Pamba / Vembanad',
    latitude: 9.4981,
    longitude: 76.3388,
    status: 'weather_only',
    danger_level: '1.20 m MSL',
    warning_level: '0.90 m MSL',
    hfl: '2.10 m (Aug-2018)',
    danger_exceedances: 35,
    warning_exceedances: 72,
    monitored_days: 3000,
    hydrological_type: 'Lowland Backwater Inundation',
    rationale: 'Below sea-level (-1.5m to -2.0m) delta; prolonged drainage blockage, tidal waterlogging, and deltaic submergence.',
    current_risk_score: 0.5120,
    current_alert: 'NORMAL'
  },
  {
    slug: 'wayanad_vythiri',
    name: 'Vythiri / Meppadi (Kabini Catchment)',
    district: 'Wayanad',
    station_code: 'KABINI-VYTHIRI',
    river_basin: 'Kabini / Chaliyar Tributary',
    latitude: 11.5500,
    longitude: 76.0400,
    status: 'weather_only',
    danger_level: 'Slope Saturation >85%',
    warning_level: 'Rainfall >150mm/24h',
    hfl: 'Severe 2019 & 2024 Debris Flow',
    danger_exceedances: 19,
    warning_exceedances: 48,
    monitored_days: 2900,
    hydrological_type: 'Highland Flash Flood & Slope Failure',
    rationale: 'Ultra-heavy monsoon belt; rapid debris flows, flash riverine surges, and slope destabilization (Chooralmala/Meppadi).',
    current_risk_score: 0.8140,
    current_alert: 'ALERT'
  }
];

const HISTORICAL_BENCHMARKS = [
  { year: '2018', pamba_peak: '9.64 m (HFL)', meenachil_peak: '7.85 m', danger_days: '24 days', note: 'Century flood; 535mm rain in 3 days, all 35 dams opened' },
  { year: '2019', pamba_peak: '7.40 m', meenachil_peak: '7.10 m', danger_days: '12 days', note: 'Severe flash floods in North Kerala & Pamba basin' },
  { year: '2020', pamba_peak: '6.95 m', meenachil_peak: '8.24 m (HFL)', danger_days: '11 days', note: 'Meenachil basin record HFL at Kidangoor (8.24m on 09-Aug)' },
  { year: '2021', pamba_peak: '7.12 m', meenachil_peak: '6.80 m', danger_days: '15 days', note: 'October extreme late-monsoon surge with CWC flood bulletin' },
  { year: '2024', pamba_peak: '6.45 m', meenachil_peak: '6.50 m', danger_days: '8 days', note: 'Intense highland cloudburst & Wayanad slope failure' }
];

export const KeralaFloodBasinSection = () => {
  const [selectedSlug, setSelectedSlug] = useState('pathanamthitta_kozhencherry');
  const [basemapType, setBasemapType] = useState('osm'); // 'osm' (Primary) or 'canvas'

  const selectedZone = KERALA_ZONES.find(z => z.slug === selectedSlug) || KERALA_ZONES[0];

  const tileUrl = basemapType === 'canvas'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution = basemapType === 'canvas'
    ? 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const getStatusBadge = (status) => {
    if (status === 'validated') {
      return <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>VALIDATED CWC GAUGE</span>;
    }
    if (status === 'provisional') {
      return <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>PROVISIONAL MODEL</span>;
    }
    return <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>WEATHER TELEMETRY</span>;
  };

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
            <div style={{ background: '#0284c7', color: '#fff', padding: '6px', borderRadius: '10px', display: 'flex' }}>
              <Waves size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              Kerala River Basin Hydrological Watch <span style={{ color: '#0284c7' }}>& Historical Flood Intelligence</span>
            </h2>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Official Central Water Commission (CWC) 2000–2024 Gauge Telemetry · 7 Catchment Basins · Single-Score Model v2.0
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} /> CWC Approved Datums (HHS)
          </span>
          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Database size={14} /> 9,010 Days ERA5 Hydro Reanalysis
          </span>
        </div>
      </div>

      {/* Top 4 Historical Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>2018 All-Time Record HFL</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>9.64 m</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Kallooppara (Pamba) on 16-Aug-2018 (+3.64m above DL)</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>2020 Meenachil Basin Record</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ea580c', margin: '4px 0' }}>8.24 m</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Kidangoor on 09-Aug-2020 (+1.08m above DL 7.16m)</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>24-Year Gauge Exceedances</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>130 Danger Days</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>288 Warning Stage days across 9,010 monitored days</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ML Risk Scorer Architecture</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>9-Feature v2.0</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>ClippedLogisticRegression (Rain 1d/3d/7d/14d/30d + Soil)</span>
        </div>
      </div>

      {/* Main Grid: Kerala Hydrological Map + Active Basin Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.35fr) 1fr', gap: '20px' }}>
        
        {/* Left: Specialized Kerala Basin Hydrological Map */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', height: '480px', borderRadius: '20px' }}>
          {/* Basemap Switcher Floating Control */}
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.92)', padding: '4px 8px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={13} /> Basemap:
            </span>
            <button
              onClick={() => setBasemapType('osm')}
              style={{
                border: 'none',
                background: basemapType === 'osm' ? '#0284c7' : 'transparent',
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
                background: basemapType === 'canvas' ? '#0284c7' : 'transparent',
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

          {/* Floating Map Subtitle Pill */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1000, background: 'rgba(255,255,255,0.92)', padding: '4px 10px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backdropFilter: 'blur(8px)', fontSize: '11px', fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={13} /> 7 Monitored River Basins
          </div>

          <MapContainer
            center={[10.10, 76.60]}
            zoom={7.5}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution={tileAttribution}
              url={tileUrl}
            />

            {KERALA_ZONES.map((zone) => {
              const isSelected = zone.slug === selectedSlug;
              const isAlert = zone.current_alert === 'ALERT';
              const isWarning = zone.current_alert === 'WARNING';
              const markerColor = isAlert ? '#dc2626' : (isWarning ? '#ea580c' : '#16a34a');

              return (
                <React.Fragment key={zone.slug}>
                  {/* Catchment Radius Ring */}
                  <CircleMarker
                    center={[zone.latitude, zone.longitude]}
                    radius={isSelected ? 26 : 18}
                    pathOptions={{
                      color: markerColor,
                      fillColor: markerColor,
                      fillOpacity: isSelected ? 0.28 : 0.12,
                      weight: isSelected ? 2.5 : 1.2
                    }}
                  />

                  {/* Center Gauge Marker */}
                  <CircleMarker
                    center={[zone.latitude, zone.longitude]}
                    radius={isSelected ? 10 : 7}
                    eventHandlers={{
                      click: () => setSelectedSlug(zone.slug)
                    }}
                    pathOptions={{
                      color: '#ffffff',
                      fillColor: markerColor,
                      fillOpacity: 1,
                      weight: 2
                    }}
                  >
                    <Tooltip permanent={true} direction="right" offset={[10, 0]}>
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>
                        {zone.name.split(' ')[0]} ({zone.river_basin})
                      </span>
                    </Tooltip>

                    <Popup>
                      <div style={{ minWidth: '180px', fontFamily: 'system-ui, sans-serif' }}>
                        <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>{zone.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{zone.district} District</div>
                        <div style={{ fontSize: '11px' }}>Danger Level: <strong>{zone.danger_level}</strong></div>
                        <div style={{ fontSize: '11px' }}>2018 HFL: <strong style={{ color: '#dc2626' }}>{zone.hfl}</strong></div>
                        <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                          {getStatusBadge(zone.status)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* Right: Active Basin Telemetry & Gauge Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  Selected River Basin Gauge
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>
                  {selectedZone.name}
                </h3>
                <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>
                  District: {selectedZone.district} · River: {selectedZone.river_basin}
                </span>
              </div>
              <div>{getStatusBadge(selectedZone.status)}</div>
            </div>

            {/* Gauge Levels Table */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>DANGER LEVEL</span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#dc2626' }}>{selectedZone.danger_level}</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>WARNING LEVEL</span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#ea580c' }}>{selectedZone.warning_level}</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>HISTORICAL HFL</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{selectedZone.hfl}</div>
              </div>
            </div>

            {/* Risk Score Gauge Bar */}
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  Hydrological Risk Score (v2.0 Model)
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: getAlertColor(selectedZone.current_alert) }}>
                  {selectedZone.current_risk_score.toFixed(4)} · {selectedZone.current_alert}
                </span>
              </div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${selectedZone.current_risk_score * 100}%`,
                    background: getAlertColor(selectedZone.current_alert),
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: '#94a3b8' }}>
                <span>0.0 (Normal)</span>
                <span>0.50 (Warning Threshold)</span>
                <span>1.0 (Extreme Hazard)</span>
              </div>
            </div>

            {/* Catchment Rationale & CWC Station Code */}
            <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
              <strong>Catchment Rationale:</strong> {selectedZone.rationale}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
              <span>CWC Station: <strong>{selectedZone.station_code}</strong></span>
              <span>Type: <strong>{selectedZone.hydrological_type}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Basin Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {KERALA_ZONES.map((zone) => {
          const isSelected = zone.slug === selectedSlug;
          return (
            <button
              key={zone.slug}
              onClick={() => setSelectedSlug(zone.slug)}
              style={{
                flex: '1 0 auto',
                padding: '10px 14px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                background: isSelected ? '#f0f9ff' : '#ffffff',
                color: isSelected ? '#0369a1' : '#334155',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>{zone.name.split(' ')[0]}</span>
                <span style={{ height: '7px', width: '7px', borderRadius: '50%', background: getAlertColor(zone.current_alert) }}></span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{zone.river_basin} River</span>
            </button>
          );
        })}
      </div>

      {/* Historical Flood Chronology Table (2018–2024 Audit Archive) */}
      <div className="glass-card" style={{ padding: '18px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color="#dc2626" />
          Historical Kerala Flood Exceedance Archive (Central Water Commission Validated Benchmarks)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                <th style={{ padding: '8px 12px' }}>YEAR</th>
                <th style={{ padding: '8px 12px' }}>PAMBA PEAK (KALLOOPPARA)</th>
                <th style={{ padding: '8px 12px' }}>MEENACHIL PEAK (KIDANGOOR)</th>
                <th style={{ padding: '8px 12px' }}>DANGER DAYS (EXCEEDANCE)</th>
                <th style={{ padding: '8px 12px' }}>HYDROLOGICAL EVENT CONTEXT</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICAL_BENCHMARKS.map((item, idx) => (
                <tr key={item.year} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{item.year}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: item.pamba_peak.includes('HFL') ? '#dc2626' : '#334155' }}>
                    {item.pamba_peak}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: item.meenachil_peak.includes('HFL') ? '#ea580c' : '#334155' }}>
                    {item.meenachil_peak}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0284c7' }}>{item.danger_days}</td>
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

export default KeralaFloodBasinSection;
