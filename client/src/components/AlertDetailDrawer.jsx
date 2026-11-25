import React from 'react';
import { X, ShieldAlert, PhoneCall } from 'lucide-react';

const AlertDetailDrawer = ({ alert, language, onClose, helplines = [] }) => {
  if (!alert) return null;
  const stateHelplines = helplines.filter(h => h.state === alert.state);

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', zIndex: 1000, padding: '24px', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>{alert.severity} ALERT</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: '16px' }}>{alert.headline}</h2>
      <p style={{ fontSize: '13px', color: '#475569' }}>{alert.description?.[language] || alert.description?.en}</p>

      <h4>Emergency Helplines ({alert.state})</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {stateHelplines.map(h => (
          <a key={h.id || h.name} href={`tel:${h.phone_number}`} style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '10px', borderRadius: '8px', textDecoration: 'none', color: '#0f172a', fontWeight: 'bold' }}>
            <span>{h.name}</span>
            <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}><PhoneCall size={14}/> {h.phone_number}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AlertDetailDrawer;
