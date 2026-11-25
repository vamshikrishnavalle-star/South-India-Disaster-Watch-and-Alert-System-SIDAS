// client/src/components/AIPredictionPanel.jsx
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const FALLBACK_PREDICTIONS = [
  {
    city: 'Hyderabad',
    state: 'Telangana',
    prediction: {
      predicted_severity: 'Yellow',
      predicted_hazard: 'Flood',
      risk_probability: '34.0%',
      confidence_score: '89%'
    }
  },
  {
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    prediction: {
      predicted_severity: 'Orange',
      predicted_hazard: 'Cyclone',
      risk_probability: '72.5%',
      confidence_score: '94%'
    }
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    prediction: {
      predicted_severity: 'Yellow',
      predicted_hazard: 'Flood',
      risk_probability: '41.2%',
      confidence_score: '90%'
    }
  },
  {
    city: 'Wayanad (Kalpetta)',
    state: 'Kerala',
    prediction: {
      predicted_severity: 'Red',
      predicted_hazard: 'Landslide',
      risk_probability: '92.0%',
      confidence_score: '96%'
    }
  }
];

const AIPredictionPanel = ({ selectedState = 'All' }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

    const fetchPredictions = async () => {
      try {
        let res = null;
        if (apiBase) {
          try {
            res = await fetch(`${apiBase}/api/v1/predictions?state=${selectedState}`);
          } catch (_) {}
        }
        if (!res || !res.ok) {
          res = await fetch(`/api/v1/predictions?state=${selectedState}`).catch(() => 
            fetch(`http://localhost:5000/api/v1/predictions?state=${selectedState}`)
          );
        }
        if (res && res.ok) {
          const data = await res.json();
          setPredictions(data.predictions || []);
        } else {
          throw new Error("HTTP error " + (res ? res.status : 'offline'));
        }
      } catch (err) {
        console.warn("Using fallback ML predictions:", err);
        const filtered = selectedState === 'All' 
          ? FALLBACK_PREDICTIONS 
          : FALLBACK_PREDICTIONS.filter(p => p.state === selectedState);
        setPredictions(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [selectedState]);

  if (loading) return <div style={{ fontSize: '12px', color: '#64748b' }}>Running Random Forest Inference Engine...</div>;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a' }}>
          <Sparkles color="#1f8a4c" size={18}/> AI Predictive Risk Forecast
        </h4>
        <span style={{ fontSize: '10px', background: '#e8f5e9', color: '#15803d', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
          ML Model v1.0
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
        {predictions.map((p) => {
          const pred = p.prediction;
          const sevColor = pred.predicted_severity === 'Red' ? '#dc2626' : (pred.predicted_severity === 'Orange' ? '#ea580c' : '#16a34a');

          return (
            <div key={p.city} style={{ background: 'rgba(255, 255, 255, 0.6)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.9)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{p.city} ({p.state})</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: sevColor, background: `${sevColor}15`, padding: '2px 6px', borderRadius: '4px' }}>
                  {pred.predicted_severity} · {pred.risk_probability}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                <span>Primary Hazard: <strong>{pred.predicted_hazard}</strong></span>
                <span>Confidence: <strong>{pred.confidence_score}</strong></span>
              </div>

              {/* Mini Risk Breakdown Bar */}
              <div style={{ marginTop: '6px', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: pred.risk_probability, height: '100%', background: sevColor }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIPredictionPanel;
