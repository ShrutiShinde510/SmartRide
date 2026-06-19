import { useState } from 'react';

export default function TrackingPage() {
  const [sharing, setSharing] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>Live Tracking</div>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 24 }}>Real-time location of your active ride</div>

      {/* Map Canvas */}
      <div style={{ position: 'relative', height: 360, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 20, background: 'radial-gradient(ellipse at 40% 60%, rgba(0,219,231,0.06) 0%, transparent 70%), linear-gradient(180deg, #020e1c 0%, #041830 100%)' }}>
        {/* Grid overlay */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.07 }} width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00dbe7" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Mock road lines */}
        <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%">
          <line x1="0" y1="55%" x2="100%" y2="45%" stroke="rgba(0,219,231,0.12)" strokeWidth="3" strokeDasharray="8 6"/>
          <line x1="40%" y1="0" x2="55%" y2="100%" stroke="rgba(0,219,231,0.08)" strokeWidth="2" strokeDasharray="8 6"/>
        </svg>

        {/* Destination pin */}
        <div style={{ position: 'absolute', top: '25%', right: '28%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff4d4d', border: '2px solid #031427', boxShadow: '0 0 12px rgba(255,77,77,0.6)' }} />
          <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.50)', marginTop: 4, background: 'rgba(2,14,28,0.80)', padding: '2px 6px', borderRadius: 4 }}>Destination</div>
        </div>

        {/* Driver vehicle pin (animated) */}
        <div style={{ position: 'absolute', top: '52%', left: '42%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,219,231,0.15)', border: '2px solid #00dbe7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0,219,231,0.40)', animation: 'glowPulse 2s infinite' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#00dbe7' }}>directions_car</span>
          </div>
          <div style={{ fontSize: 10, color: '#00dbe7', marginTop: 4, background: 'rgba(2,14,28,0.85)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>Suresh</div>
        </div>

        {/* You pin */}
        <div style={{ position: 'absolute', top: '68%', left: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#22d3a0', border: '3px solid #031427', boxShadow: '0 0 10px rgba(34,211,160,0.5)' }} />
          <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.40)', marginTop: 4, background: 'rgba(2,14,28,0.80)', padding: '2px 6px', borderRadius: 4 }}>You</div>
        </div>

        {/* Route path */}
        <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%">
          <polyline points="22%,72% 35%,62% 46%,56% 58%,40% 72%,29%" fill="none" stroke="#00dbe7" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.5"/>
        </svg>

        {/* ETA badge */}
        <div style={{ position: 'absolute', top: 16, left: 16, padding: '8px 14px', borderRadius: 10, background: 'rgba(0,219,231,0.10)', border: '1px solid rgba(0,219,231,0.25)', backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.50)', fontWeight: 600 }}>ETA</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#00dbe7' }}>12 min</div>
        </div>

        {/* Speed badge */}
        <div style={{ position: 'absolute', top: 16, right: 16, padding: '8px 14px', borderRadius: 10, background: 'rgba(2,14,28,0.75)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.40)', fontWeight: 600 }}>SPEED</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe' }}>42 <span style={{ fontSize: 11, fontWeight: 500 }}>km/h</span></div>
        </div>
      </div>

      {/* Driver Info */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.12),rgba(0,100,120,0.08))', border: '1px solid rgba(0,219,231,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#00dbe7' }}>person</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>Suresh Borate</div>
            <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>Planned Trip · Wagon R · MH 15 AB 4321</div>
            <div style={{ fontSize: 11, color: '#fbbf24', marginTop: 3 }}>★ 4.8 · Verified Driver</div>
          </div>
        </div>
        <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00dbe7' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>call</span>
        </button>
      </div>

      {/* Share Location */}
      <button onClick={() => setSharing(!sharing)}
        style={{ width: '100%', padding: '13px', borderRadius: 12, background: sharing ? 'rgba(34,211,160,0.08)' : 'rgba(255,255,255,0.03)', border: sharing ? '1px solid rgba(34,211,160,0.25)' : '1px solid rgba(255,255,255,0.08)', color: sharing ? '#22d3a0' : 'rgba(211,228,254,0.60)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{sharing ? 'share_location' : 'location_off'}</span>
        {sharing ? 'Sharing live location with emergency contact' : 'Share live location with emergency contact'}
      </button>
    </div>
  );
}
