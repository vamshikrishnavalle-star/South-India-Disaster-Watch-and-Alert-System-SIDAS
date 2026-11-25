import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom high-contrast SVG divIcons for crisp rendering without external CDN image latency
const createPulsingIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: ${color}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const redPin = createPulsingIcon('#dc2626');
const orangePin = createPulsingIcon('#ea580c');
const yellowPin = createPulsingIcon('#ca8a04');
const greenPin = createPulsingIcon('#16a34a');

const getMarkerIcon = (severity) => {
  if (severity === 'Red') return redPin;
  if (severity === 'Orange') return orangePin;
  if (severity === 'Yellow') return yellowPin;
  return greenPin;
};

const getCircleColor = (severity) => {
  if (severity === 'Red') return '#dc2626';
  if (severity === 'Orange') return '#ea580c';
  if (severity === 'Yellow') return '#ca8a04';
  return '#16a34a';
};

const DistrictLeafletMap = ({ alerts = [], onSelectAlert }) => {
  // Center centered on South India (encompassing TS, AP, TN, Kerala)
  const mapCenter = [14.2, 78.8];

  return (
    <div className="glass-card" style={{ height: '540px', width: '100%', borderRadius: '20px', overflow: 'hidden', padding: '0', position: 'relative' }}>
      <style>
        {`
          @keyframes ping {
            75%, 100% {
              transform: scale(2.2);
              opacity: 0;
            }
          }
        `}
      </style>
      <MapContainer
        center={mapCenter}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', borderRadius: '20px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {alerts.map((a) => {
          if (!a.latitude || !a.longitude) return null;
          const lat = parseFloat(a.latitude);
          const lng = parseFloat(a.longitude);
          const col = getCircleColor(a.severity);

          return (
            <React.Fragment key={a.id || a.external_id || `${lat}-${lng}`}>
              {/* Radar Circle */}
              <Circle
                center={[lat, lng]}
                radius={(a.radius_km || 30) * 1000}
                pathOptions={{
                  color: col,
                  fillColor: col,
                  fillOpacity: a.severity === 'Red' ? 0.25 : 0.15,
                  weight: 2
                }}
              />

              {/* Pin with animated pulse */}
              <Marker position={[lat, lng]} icon={getMarkerIcon(a.severity)}>
                <Popup>
                  <div style={{ minWidth: '190px', fontFamily: 'system-ui, sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: col, textTransform: 'uppercase' }}>
                        {a.severity} ALERT
                      </span>
                      <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {a.hazard}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '4px' }}>
                      {a.district} ({a.state})
                    </div>

                    <p style={{ fontSize: '11px', color: '#475569', margin: '4px 0 8px 0', lineHeight: 1.3 }}>
                      {a.headline}
                    </p>

                    <button
                      onClick={() => onSelectAlert(a)}
                      style={{
                        width: '100%',
                        background: '#1f8a4c',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      View Helplines & Advisories →
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DistrictLeafletMap;
