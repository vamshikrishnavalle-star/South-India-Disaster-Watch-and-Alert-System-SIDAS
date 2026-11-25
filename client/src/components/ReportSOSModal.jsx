import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ReportSOSModal = ({ isOpen, onClose, selectedState }) => {
  const [formData, setFormData] = useState({ reporter_name: '', state: selectedState !== 'All' ? selectedState : 'Telangana', district: '', incident_type: 'Flood Inundation', description: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/v1/reports', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      alert("SOS Transmitted to Emergency Ops.");
    } catch (err) {
      alert("Failed to submit SOS report: " + err.message);
    }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#ffffff', width: '440px', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, display: 'flex', gap: '8px' }}><AlertCircle color="#dc2626"/> Submit SOS Incident</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input required placeholder="Your Name" onChange={e => setFormData({...formData, reporter_name: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}/>
          <input required placeholder="District" onChange={e => setFormData({...formData, district: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}/>
          <textarea required placeholder="Describe situation..." onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}/>
          <button type="submit" style={{ background: '#dc2626', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Transmit Emergency SOS</button>
        </form>
      </div>
    </div>
  );
};

export default ReportSOSModal;
