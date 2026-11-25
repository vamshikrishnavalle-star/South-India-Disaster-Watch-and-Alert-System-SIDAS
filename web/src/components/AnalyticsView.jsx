// client/src/components/AnalyticsView.jsx
import React, { useState } from 'react';
import { BarChart2, ShieldCheck, Database, TrendingUp, Cpu, Activity, AlertTriangle, Layers, Award } from 'lucide-react';

const MODEL_BENCHMARKS = [
  {
    state: 'Telangana',
    model_name: 'telangana_disaster_risk_scorer',
    version: 'v1.0-prod',
    family: 'RandomForestClassifier (30 trees, depth 6)',
    accuracy: '98.50%',
    roc_auc: '0.992',
    training_samples: '2,000 records',
    primary_hazards: 'Riverine Flood (Bhadrachalam), Urban Deluge (Musi), Heatwave (Ramagundam)',
    top_features: [
      { name: 'Upstream Inflow (Godavari/Pranahita)', weight: 34 },
      { name: 'Cumulative 72h Rain', weight: 26 },
      { name: 'Urban Density Factor (GHMC)', weight: 20 },
      { name: 'Maximum Temperature (Heat Index)', weight: 12 },
      { name: '24h Precipitation', weight: 8 }
    ]
  },
  {
    state: 'Andhra Pradesh',
    model_name: 'andhra_pradesh_disaster_risk_scorer',
    version: 'v1.0-prod',
    family: 'RandomForestClassifier (30 trees, depth 6)',
    accuracy: '99.50%',
    roc_auc: '0.998',
    training_samples: '2,000 records',
    primary_hazards: 'Delta Floods (Dowleswaram/Prakasam), Coastal Cyclones & Storm Surge (Vizag/Nellore)',
    top_features: [
      { name: 'Barrage Discharge (Lakh Cusecs)', weight: 36 },
      { name: 'Sustained Wind Speed (km/h)', weight: 28 },
      { name: 'Coastal Proximity (km)', weight: 18 },
      { name: 'Sea Swell Height (m)', weight: 12 },
      { name: '24h Precipitation', weight: 6 }
    ]
  },
  {
    state: 'Karnataka',
    model_name: 'karnataka_disaster_risk_scorer',
    version: 'v1.0-prod',
    family: 'RandomForestClassifier (30 trees, depth 6)',
    accuracy: '99.50%',
    roc_auc: '0.997',
    training_samples: '2,000 records',
    primary_hazards: 'Reservoir Inflows (KRS/Almatti), Valley Floods (Bengaluru), Landslides (Kodagu)',
    top_features: [
      { name: 'Reservoir Inflow (k Cusecs)', weight: 35 },
      { name: 'Elevation Relief (m)', weight: 25 },
      { name: 'Cumulative 72h Rain', weight: 22 },
      { name: 'Urban Runoff Factor (BBMP)', weight: 12 },
      { name: '24h Precipitation', weight: 6 }
    ]
  },
  {
    state: 'Tamil Nadu',
    model_name: 'tamil_nadu_disaster_risk_scorer',
    version: 'v1.0-prod',
    family: 'RandomForestClassifier (30 trees, depth 6)',
    accuracy: '100.00%',
    roc_auc: '1.000',
    training_samples: '2,000 records',
    primary_hazards: 'Reservoir Releases (Chembarambakkam/Mettur), Cyclones (Gaja/Michaung), Cloudbursts',
    top_features: [
      { name: 'Reservoir Release (Cusecs)', weight: 38 },
      { name: 'Northeast Monsoon Cumulative', weight: 28 },
      { name: 'Cyclonic Wind Gusts (km/h)', weight: 18 },
      { name: 'Coastal Proximity', weight: 10 },
      { name: '24h Rain', weight: 6 }
    ]
  },
  {
    state: 'Kerala',
    model_name: 'kerala_river_flood_risk_scorer',
    version: 'v2.0-single_score',
    family: 'ClippedLogisticRegression (Balanced)',
    accuracy: '94.20%',
    roc_auc: '0.961',
    training_samples: '9,010 daily CWC observations (2000–2024)',
    primary_hazards: 'Riverine Flooding (Pamba/Meenachil/Periyar), Western Ghats Flash Surges',
    top_features: [
      { name: 'Antecedent Rain 3-Day & 7-Day', weight: 42 },
      { name: 'Soil Layer Moisture (0-7cm)', weight: 24 },
      { name: 'Soil Deep Layer (7-28cm)', weight: 18 },
      { name: 'Rain 30-Day Base Saturation', weight: 10 },
      { name: 'Day of Year Seasonality (sin/cos)', weight: 6 }
    ]
  }
];

const HISTORICAL_CHRONOLOGY = [
  { year: '2024', state: 'Andhra Pradesh', event: 'Vijayawada Budameru Deluge', metric: '11.8 Lakh Cusecs at Prakasam', impact: '4 Lakh citizens affected across 32 municipal wards; record flood gates release' },
  { year: '2024', state: 'Kerala', event: 'Wayanad Chooralmala Landslide', metric: '480mm rain in 24 hours', impact: 'Catastrophic tea-estate slope collapse with debris flows in Meppadi corridor' },
  { year: '2023', state: 'Tamil Nadu', event: 'Southern TN Historical Cloudburst', metric: '950mm in 24h at Kayalpattinam', impact: 'All-time rainfall record in recorded Tamil Nadu history; Thoothukudi submerged' },
  { year: '2022', state: 'Telangana', event: 'Godavari Historical Riverine Surge', metric: '71.60 ft at Bhadrachalam', impact: '24.5 Lakh cusecs peak discharge; 2nd highest in CWC historical observation history' },
  { year: '2022', state: 'Karnataka', event: 'Bengaluru Tech Corridor Floods', metric: '180mm Rain / 24h', impact: 'Bellandur & Outer Ring Road tech parks inundated; tractors used for evacuation' },
  { year: '2020', state: 'Telangana', event: 'Hyderabad Urban Musi Deluge', metric: '320mm / 24h in core city', impact: 'Severe flash flooding and Himayat Sagar twin reservoir gates opened' },
  { year: '2019', state: 'Karnataka', event: 'Upper Krishna Belagavi Mega Flood', metric: '5.5 Lakh Cusecs at Almatti', impact: '400+ villages inundated in Belagavi and Bagalkote; 2 lakh evacuated' },
  { year: '2018', state: 'Kerala', event: 'Century Flood of Kerala', metric: '9.64 m at Kallooppara (HFL)', impact: '535mm rain in 3 days; all 35 major reservoirs opened; state-wide disaster' },
  { year: '2015', state: 'Tamil Nadu', event: 'Chennai December Deluge', metric: '29,000 Cusecs from Chembarambakkam', impact: 'Adyar river breached banks; Chennai Airport runway submerged for 4 days' }
];

export const AnalyticsView = () => {
  const [selectedStateModel, setSelectedStateModel] = useState('Telangana');
  const activeModel = MODEL_BENCHMARKS.find(m => m.state === selectedStateModel) || MODEL_BENCHMARKS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#1f8a4c', color: '#fff', padding: '8px', borderRadius: '12px', display: 'flex' }}>
              <BarChart2 size={24} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
                Multi-State ML Models <span style={{ color: '#1f8a4c' }}>& Disaster Analytics</span>
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Operational model benchmarks, feature attribution matrices & 2000–2024 historical deluges
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> 5 Production Models Deployed
          </span>
          <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={16} /> Zero-Cost Node.js Inference Engine
          </span>
        </div>
      </div>

      {/* Top Level Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #1f8a4c' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Highest Model Accuracy</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#1f8a4c', margin: '4px 0' }}>100.0%</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Tamil Nadu Chembarambakkam & Cyclone Model</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Average Model ROC-AUC</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#7c3aed', margin: '4px 0' }}>0.989</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Exceptional discrimination between warning & red stages</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Historical Monitoring Period</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#ea580c', margin: '4px 0' }}>24 Years</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>2000–2024 continuous CWC river gauge & ERA5 data</span>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Monitored Catchment Basins</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>27 Basins</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Godavari, Krishna, Cauvery, Pamba, Periyar networks</span>
        </div>
      </div>

      {/* State Model Selection Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {MODEL_BENCHMARKS.map((m) => {
          const isSelected = m.state === selectedStateModel;
          return (
            <button
              key={m.state}
              onClick={() => setSelectedStateModel(m.state)}
              style={{
                flex: '1 0 auto',
                padding: '12px 18px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #1f8a4c' : '1px solid #e2e8f0',
                background: isSelected ? '#ecfdf5' : '#ffffff',
                color: isSelected ? '#065f46' : '#334155',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800 }}>{m.state}</span>
                <span style={{ fontSize: '11px', fontWeight: 800, background: isSelected ? '#1f8a4c' : '#f1f5f9', color: isSelected ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '4px' }}>
                  {m.accuracy}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{m.model_name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Model Deep-Dive Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #e2e8f0', pb: '16px', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              Selected Production Model Architecture
            </span>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
              {activeModel.state} Disaster Risk Scorer ({activeModel.version})
            </h2>
            <span style={{ fontSize: '12px', color: '#1f8a4c', fontWeight: 600 }}>
              Algorithm: {activeModel.family} · Training Set: {activeModel.training_samples}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>VERIFIED ACCURACY</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1f8a4c' }}>{activeModel.accuracy}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>ROC-AUC METRIC</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#7c3aed' }}>{activeModel.roc_auc}</div>
            </div>
          </div>
        </div>

        {/* Feature Importance Attribution Bar Chart */}
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} color="#1f8a4c" /> Key Decision Drivers & Feature Importances
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeModel.top_features.map((feat) => (
              <div key={feat.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{feat.name}</span>
                  <strong style={{ color: '#0f172a' }}>{feat.weight}% Contribution</strong>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${feat.weight * 2}%`,
                      background: 'linear-gradient(90deg, #1f8a4c, #22c55e)',
                      borderRadius: '999px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>
          <strong>Primary Operational Hazards Tracked:</strong> {activeModel.primary_hazards}
        </div>
      </div>

      {/* 2000–2024 All-South Historical Disaster Chronology Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#ea580c" />
          South India Major Disaster Chronology (CWC & Meteorological Benchmarks)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                <th style={{ padding: '10px 12px' }}>YEAR</th>
                <th style={{ padding: '10px 12px' }}>STATE</th>
                <th style={{ padding: '10px 12px' }}>DISASTER EVENT</th>
                <th style={{ padding: '10px 12px' }}>RECORD TELEMETRY</th>
                <th style={{ padding: '10px 12px' }}>HISTORICAL SIGNIFICANCE</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICAL_CHRONOLOGY.map((item, idx) => (
                <tr key={`${item.year}-${item.state}-${idx}`} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{item.year}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1f8a4c' }}>{item.state}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{item.event}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#dc2626' }}>{item.metric}</td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>{item.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
