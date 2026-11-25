import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41]
});

const DistrictLeafletMap = ({ alerts = [], onSelectAlert }) => {
  return (
    <div style={{ height: '540px', width: '100%', borderRadius: '20px', overflow: 'hidden' }}>
      <MapContainer center={[13.0827, 78.5000]} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {alerts.map((a) => a.latitude && (
          <React.Fragment key={a.id || a.external_id}>
            <Circle center={[parseFloat(a.latitude), parseFloat(a.longitude)]} radius={30000} pathOptions={{ color: '#dc2626' }} />
            <Marker position={[parseFloat(a.latitude), parseFloat(a.longitude)]} icon={redIcon}>
              <Popup>
                <div>
                  <strong>{a.headline}</strong>
                  <br/>
                  <button onClick={() => onSelectAlert(a)} style={{ background: '#1f8a4c', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', marginTop: '6px', cursor: 'pointer' }}>View Details</button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default DistrictLeafletMap;
