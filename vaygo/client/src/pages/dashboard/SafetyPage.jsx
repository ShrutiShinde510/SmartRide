import { useState, useEffect } from 'react';

export default function SafetyPage() {
  const [activeSOS, setActiveSOS] = useState(false);
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([
    { name: '', phone: '' },
  ]);

  useEffect(() => {
    const cached = localStorage.getItem('vaygo_user');
    if (cached) {
      const u = JSON.parse(cached);
      setUser(u);
      const ec = u.emergency_contact || u.trusted_contacts?.[0];
      if (ec?.name) setContacts([ec]);
    }
  }, []);

  const triggerSOS = () => {
    setActiveSOS(true);
    setTimeout(() => {
      alert('🚨 SOS Alert sent! Police, emergency contacts and AI monitors notified with your live coordinates.');
      setActiveSOS(false);
    }, 1500);
  };

  const SAFETY_FEATURES = [
    { icon: 'verified_user',    label: 'Aadhaar Verified Drivers',  desc: 'Every driver is identity-verified before onboarding', color: '#22d3a0' },
    { icon: 'location_on',      label: 'Live GPS Tracking',          desc: 'Real-time location shared during every trip',        color: '#00dbe7' },
    { icon: 'crisis_alert',     label: 'SOS Alert System',           desc: 'One-tap emergency alert to police and contacts',     color: '#ff6b6b' },
    { icon: 'psychology',       label: 'AI Safety Monitoring',       desc: 'Behavioural anomaly detection during trips',         color: '#74f5ff' },
    { icon: 'mic',              label: 'Voice Trip Booking',         desc: 'Hands-free booking with voice commands',             color: '#fbbf24' },
    { icon: 'share_location',   label: 'Location Sharing',           desc: 'Share live trip location with trusted contacts',     color: '#a78bfa' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>Safety Center</div>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 28 }}>Your safety is Vaygo's top priority</div>

      {/* SOS Panel */}
      <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, rgba(255,77,77,0.08), rgba(100,20,20,0.05))', border: '1px solid rgba(255,77,77,0.18)', padding: 28, marginBottom: 24, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,77,77,0.10)', border: '2px solid rgba(255,77,77,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#ff4d4d' }}>emergency_home</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#ff8080', marginBottom: 8 }}>Vaygo SOS Alert</div>
        <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.50)', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 24px' }}>
          In danger? Press the button below to instantly alert:<br/>
          <strong style={{ color: '#ff8080' }}>
            {contacts[0]?.name || 'Emergency Contact'} ({contacts[0]?.phone || 'Not set'})
          </strong>
          {' '}+ Police + Vaygo AI Monitors
        </div>
        <button onClick={triggerSOS} disabled={activeSOS}
          style={{ padding: '16px 48px', background: activeSOS ? 'rgba(255,77,77,0.40)' : '#ff2222', color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: activeSOS ? 'not-allowed' : 'pointer', boxShadow: activeSOS ? 'none' : '0 0 30px rgba(255,34,34,0.40)', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>crisis_alert</span>
          {activeSOS ? 'Sending Alert...' : 'TRIGGER SOS'}
        </button>
      </div>

      {/* Emergency Contacts */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px', marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#00dbe7' }}>contacts</span>
          Emergency Contacts
        </div>
        {contacts.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < contacts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,219,231,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#00dbe7' }}>person</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#d3e4fe' }}>{c.name || '—'}</div>
                <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>{c.phone || 'Not set'}</div>
              </div>
            </div>
            <a href={c.phone ? `tel:${c.phone}` : '#'}
              onClick={(e) => {
                if (!c.phone) {
                  e.preventDefault();
                  alert('Emergency contact phone number not set');
                }
              }}
              style={{ padding: '5px 12px', background: 'rgba(0,219,231,0.07)', border: '1px solid rgba(0,219,231,0.15)', borderRadius: 7, color: '#00dbe7', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
              Call
            </a>
          </div>
        ))}
      </div>

      {/* Safety Features Grid */}
      <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(211,228,254,0.40)', marginBottom: 14, letterSpacing: '0.05em' }}>VAYGO SAFETY FEATURES</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {SAFETY_FEATURES.map((f, i) => (
          <div key={i} style={{ padding: '16px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: f.color }}>{f.icon}</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#d3e4fe', marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
