// client/src/components/EmergencyDirectoryView.jsx
import React, { useState } from 'react';
import { Phone, Shield, Radio, Search, AlertOctagon, CheckCircle2, Clock, MapPin, Users, HeartHandshake, ExternalLink, HelpCircle } from 'lucide-react';

const EMERGENCY_CONTACTS = [
  // Telangana
  { id: 'ts-1', state: 'Telangana', category: 'SDMA Control Room', title: 'Telangana State Disaster Control Room', phone: '1070', altPhone: '040-23450624', location: 'BRKR Bhavan, Hyderabad', badge: '24x7 Active', type: 'Primary' },
  { id: 'ts-2', state: 'Telangana', category: 'Urban Flood / Rescue', title: 'GHMC Disaster Management Cell', phone: '040-21111111', altPhone: '9000113667', location: 'Hyderabad Metro', badge: 'GHMC Central', type: 'Urban' },
  { id: 'ts-3', state: 'Telangana', category: 'Police / First Responder', title: 'Telangana Police Emergency', phone: '100', altPhone: '112', location: 'Statewide', badge: 'Emergency 112', type: 'First Responder' },
  { id: 'ts-4', state: 'Telangana', category: 'SDRF Battalion', title: 'Telangana State Disaster Response Force', phone: '040-24440300', altPhone: '101', location: 'Amberpet / Statewide', badge: 'Search & Rescue', type: 'Rescue' },

  // Andhra Pradesh
  { id: 'ap-1', state: 'Andhra Pradesh', category: 'APSDMA Control Room', title: 'AP State Emergency Operations Centre (SEOC)', phone: '1070', altPhone: '0863-2377018', location: 'Tadepalli, Guntur', badge: '24x7 Command', type: 'Primary' },
  { id: 'ap-2', state: 'Andhra Pradesh', category: 'Coastal & Cyclone', title: 'Visakhapatnam GVMC Disaster Cell', phone: '0891-2869100', altPhone: '18004250001', location: 'Visakhapatnam Coast', badge: 'Cyclone Ready', type: 'Coastal' },
  { id: 'ap-3', state: 'Andhra Pradesh', category: 'NDRF Battalion Base', title: '10th Battalion NDRF (Vijayawada)', phone: '08676-258055', altPhone: '9440627770', location: 'Mangalagiri, AP', badge: 'Specialist Flood Unit', type: 'NDRF' },
  { id: 'ap-4', state: 'Andhra Pradesh', category: 'Irrigation & Floods', title: 'Prakasam / Godavari Barrage Flood Control', phone: '0866-2575444', altPhone: '1077', location: 'Vijayawada & Dowleswaram', badge: 'Hydrological', type: 'Hydrological' },

  // Karnataka
  { id: 'ka-1', state: 'Karnataka', category: 'KSDMA Control Room', title: 'Karnataka State Disaster Management Authority', phone: '1070', altPhone: '080-22340676', location: 'MS Building, Bengaluru', badge: 'State SEOC', type: 'Primary' },
  { id: 'ka-2', state: 'Karnataka', category: 'Urban Flood / BBMP', title: 'BBMP Disaster Control Room & Flood Helpline', phone: '1533', altPhone: '080-22660000', location: 'Bengaluru Urban & BBMP', badge: 'BBMP 24x7', type: 'Urban' },
  { id: 'ka-3', state: 'Karnataka', category: 'Western Ghats / Landslide', title: 'Kodagu & Malnad Emergency Cell', phone: '08272-221077', altPhone: '1077', location: 'Madikeri & Chikkamagaluru', badge: 'Hilly Terrain', type: 'Landslide' },
  { id: 'ka-4', state: 'Karnataka', category: 'SDRF Karnataka', title: 'Karnataka State Fire & Emergency Services', phone: '101', altPhone: '080-22971500', location: 'Statewide', badge: 'Rescue Boats', type: 'Rescue' },

  // Tamil Nadu
  { id: 'tn-1', state: 'Tamil Nadu', category: 'TNSDMA Control Room', title: 'Tamil Nadu State Emergency Operations Centre', phone: '1070', altPhone: '044-28593990', location: 'Ezhilagam, Chennai', badge: '24x7 Command', type: 'Primary' },
  { id: 'tn-2', state: 'Tamil Nadu', category: 'Chennai Flood Cell', title: 'Greater Chennai Corporation (GCC) Emergency', phone: '1913', altPhone: '044-25619206', location: 'Ripon Building, Chennai', badge: 'Motor Pumps & Rescue', type: 'Urban' },
  { id: 'tn-3', state: 'Tamil Nadu', category: 'NDRF Battalion Base', title: '4th Battalion NDRF (Arakkonam)', phone: '04177-246594', altPhone: '9442105188', location: 'Arakkonam, Ranipet', badge: 'Deep Water Rescue', type: 'NDRF' },
  { id: 'tn-4', state: 'Tamil Nadu', category: 'Southern Coastal Cell', title: 'Thoothukudi / Tirunelveli Disaster Control', phone: '1077', altPhone: '0461-2340101', location: 'Southern Delta', badge: 'Flash Inundation', type: 'Coastal' },

  // Kerala
  { id: 'kl-1', state: 'Kerala', category: 'KSDMA Control Room', title: 'Kerala State Emergency Operations Centre (SEOC)', phone: '1077', altPhone: '0471-2364424', location: 'Vikas Bhavan, Thiruvananthapuram', badge: '24x7 Apex', type: 'Primary' },
  { id: 'kl-2', state: 'Kerala', category: 'Wayanad Landslide Command', title: 'Wayanad District Collectorate Emergency Cell', phone: '04936-204151', altPhone: '8078409770', location: 'Kalpetta / Meppadi', badge: 'Landslide Command', type: 'Landslide' },
  { id: 'kl-3', state: 'Kerala', category: 'Rescue & Evacuation', title: 'Kerala Fire & Rescue Services Control Room', phone: '101', altPhone: '0471-2320872', location: 'Statewide', badge: 'Rubber Inflatable Boats', type: 'Rescue' },
  { id: 'kl-4', state: 'Kerala', category: 'Medical & Health', title: 'Disha Health Emergency Helpline', phone: '1056', altPhone: '0471-2552056', location: 'Statewide', badge: 'Emergency Care', type: 'Medical' },
];

const CITIZEN_SOS_FEED = [
  {
    id: 'sos-2024-001',
    state: 'Telangana',
    district: 'Hyderabad (Moosarambagh)',
    type: 'Flash Inundation Evacuation',
    people: 6,
    priority: 'High',
    status: 'DISPATCHED',
    time: '8 mins ago',
    details: 'Basement flooded due to Musi overflow near bridge. Elderly person needing wheelchair transit.',
    contact: 'Verified Citizen ID: #TS-9812'
  },
  {
    id: 'sos-2024-002',
    state: 'Andhra Pradesh',
    district: 'Vijayawada (Ajit Singh Nagar)',
    type: 'Drinking Water & Medical Rations',
    people: 14,
    priority: 'Medium',
    status: 'IN_PROGRESS',
    time: '24 mins ago',
    details: 'Ground floor waterlogged 3 feet from Budameru backwater. Need drinking water packets & insulin.',
    contact: 'Verified Citizen ID: #AP-4102'
  },
  {
    id: 'sos-2024-003',
    state: 'Kerala',
    district: 'Wayanad (Meppadi Camp)',
    type: 'Slope Monitoring & Shelter Transit',
    people: 22,
    priority: 'Urgent',
    status: 'VERIFIED',
    time: '42 mins ago',
    details: 'Minor fissures sighted on upper tea estate terrace after 120mm rainfall. Precautionary camp transit initiated.',
    contact: 'Local Panchayat Volunteer Group'
  },
  {
    id: 'sos-2024-004',
    state: 'Karnataka',
    district: 'Bengaluru (Rainbow Drive / Bellandur)',
    type: 'Stormwater Pump Assistance',
    people: 8,
    priority: 'Moderate',
    status: 'DISPATCHED',
    time: '1 hr ago',
    details: 'Storm drain outflow choked by silt. High capacity 50HP dewatering tractor requested.',
    contact: 'Resident Welfare Association #KA-2291'
  },
  {
    id: 'sos-2024-005',
    state: 'Tamil Nadu',
    district: 'Chennai (Velachery / Madipakkam)',
    type: 'Power Inverter & Baby Food Support',
    people: 4,
    priority: 'Moderate',
    status: 'RESOLVED',
    time: '2 hrs ago',
    details: 'Power shutdown in sector 4 due to feeder inundation. Relief volunteers delivered dry food kits.',
    contact: 'GCC Volunteer Cadre #TN-8109'
  }
];

export default function EmergencyDirectoryView({ onOpenSos }) {
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredContacts = EMERGENCY_CONTACTS.filter(contact => {
    const matchesState = selectedState === 'All' || contact.state === selectedState;
    const matchesSearch = searchQuery === '' || 
      contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);
    const matchesType = filterType === 'All' || contact.type === filterType;
    return matchesState && matchesSearch && matchesType;
  });

  const filteredFeed = CITIZEN_SOS_FEED.filter(item => {
    return selectedState === 'All' || item.state === selectedState;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #091e3a 0%, #102a45 50%, #064e3b 100%)',
        borderRadius: '16px',
        padding: '28px',
        color: '#fff',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Radio size={14} color="#34d399" /> South India Unified Crisis Communications Grid
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.2 }}>
            Emergency Directory & Citizen SOS Response
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
            Direct hotline switchboard for all 5 Southern States: State Disaster Management Authorities (SDMA), NDRF Battalions, SDRF Search & Rescue Teams, and live citizen emergency incidents.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <button
            onClick={onOpenSos}
            style={{
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              padding: '12px 22px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.45)',
              transition: 'transform 0.15s ease'
            }}
          >
            <AlertOctagon size={18} /> Report Citizen SOS Incident
          </button>
          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            National Emergency Dispatch System: <strong>Dial 112</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#fff',
        borderRadius: '14px',
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        {/* State Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>State:</span>
          {['All', 'Telangana', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Kerala'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: '1px solid ' + (selectedState === st ? '#1f8a4c' : '#e2e8f0'),
                background: selectedState === st ? '#1f8a4c' : '#f8fafc',
                color: selectedState === st ? '#fff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {st === 'All' ? 'All South States (5)' : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', minWidth: '260px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search department, district or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#1e293b' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#94a3b8' }}>✕</button>
          )}
        </div>
      </div>

      {/* Main Grid: Directory Contacts (Left 2 cols) & Citizen SOS Feed (Right 1 col) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Left Column: Direct Helplines Switchboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} color="#1f8a4c" /> Emergency Control Rooms & Battalions ({filteredContacts.length})
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Toll-Free & 24/7 Monitored</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: contact.state === 'Telangana' ? '#f5f3ff' :
                                  contact.state === 'Andhra Pradesh' ? '#fff7ed' :
                                  contact.state === 'Karnataka' ? '#fefce8' :
                                  contact.state === 'Tamil Nadu' ? '#f0f9ff' : '#ecfdf5',
                      color: contact.state === 'Telangana' ? '#6d28d9' :
                             contact.state === 'Andhra Pradesh' ? '#c2410c' :
                             contact.state === 'Karnataka' ? '#854d0e' :
                             contact.state === 'Tamil Nadu' ? '#0369a1' : '#065f46',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      {contact.state} • {contact.category}
                    </span>
                    <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {contact.badge}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                    {contact.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                    <MapPin size={12} /> {contact.location}
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Primary Helpline</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1f8a4c' }}>{contact.phone}</div>
                    {contact.altPhone && (
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Alt: {contact.altPhone}</div>
                    )}
                  </div>

                  <a
                    href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                    style={{
                      background: '#1f8a4c',
                      color: '#fff',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(31, 138, 76, 0.3)'
                    }}
                  >
                    <Phone size={14} /> Call Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Disaster Response Protocols */}
          <div style={{ marginTop: '12px', background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} color="#0284c7" /> Disaster Protocol Guidelines (CWC & NDMA Guidelines)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '12px' }}>
              <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0369a1', display: 'block', marginBottom: '4px' }}>🌊 In Flash Floods:</strong>
                Never walk or drive across flooded bridges or culverts. Turn off main electrical breakers and move to upper floors with phone & dry rations.
              </div>
              <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#c2410c', display: 'block', marginBottom: '4px' }}>🌀 In Cyclone / Gale:</strong>
                Stay away from glass windows and loose metal sheets. Secure drinking water reserves and keep battery-powered radios tuned.
              </div>
              <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#854d0e', display: 'block', marginBottom: '4px' }}>⛰️ In Western Ghats Landslides:</strong>
                Listen for unusual sounds like cracking trees or sudden muddied stream water. Evacuate immediately down designated ridge roads.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Citizen SOS Emergency Dispatch Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#dc2626" /> Live Citizen SOS Feed
            </h3>
            <span style={{ fontSize: '11px', background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              Live Triage
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredFeed.map(sos => (
              <div
                key={sos.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '14px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  borderLeft: sos.priority === 'Urgent' ? '4px solid #dc2626' :
                              sos.priority === 'High' ? '4px solid #ea580c' : '4px solid #3b82f6'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>
                    {sos.district}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: sos.status === 'VERIFIED' ? '#fef3c7' :
                                sos.status === 'DISPATCHED' ? '#dbeafe' :
                                sos.status === 'IN_PROGRESS' ? '#fed7aa' : '#dcfce7',
                    color: sos.status === 'VERIFIED' ? '#92400e' :
                           sos.status === 'DISPATCHED' ? '#1e40af' :
                           sos.status === 'IN_PROGRESS' ? '#9a3412' : '#166534'
                  }}>
                    {sos.status}
                  </span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>
                  {sos.type} ({sos.people} citizens)
                </div>

                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>
                  {sos.details}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} /> {sos.time}
                  </span>
                  <span>{sos.contact}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick SOS Submission Card */}
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #fecaca',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#991b1b' }}>
              Trapped or Need Immediate Evacuation?
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#7f1d1d' }}>
              Broadcast GPS coordinates & medical urgency straight into SDRF command desk.
            </p>
            <button
              onClick={onOpenSos}
              style={{
                width: '100%',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
              }}
            >
              🚨 Open SOS Incident Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
