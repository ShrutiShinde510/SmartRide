import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([
    { label: 'Total Rides', value: '0', icon: 'directions_car', color: '#00dbe7' },
    { label: 'This Month', value: '0',  icon: 'calendar_month',  color: '#74f5ff' },
    { label: 'Saved (₹)',  value: '0', icon: 'savings',        color: '#00f1fe' },
    { label: 'Safety Score', value: '-', icon: 'shield',        color: '#22d3a0' },
  ]);
  const [recentRides, setRecentRides] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem('vaygo_user');
    if (cached) setUser(JSON.parse(cached));
  }, []);

  const name = user?.full_name || user?.personal_info?.full_name || 'Passenger';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px' }}>
          {greeting}, {name.split(' ')[0]} 👋
        </div>
        <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginTop: 4 }}>Where are you heading today?</div>
      </div>

      {/* Quick Book Card */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, padding: 28, marginBottom: 28, background: 'linear-gradient(135deg, rgba(0,219,231,0.12) 0%, rgba(0,100,120,0.08) 100%)', border: '1px solid rgba(0,219,231,0.18)' }}>
        {/* Glow blob */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(0,219,231,0.07)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe', marginBottom: 6 }}>Quick Book</div>
        <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.50)', marginBottom: 20 }}>Tap a mode to find your ride instantly</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: 'schedule',      label: 'Planned Trip',    sub: 'Carpool seats',    path: '/dashboard/search' },
            { icon: 'directions_car', label: 'Flexible Hire',  sub: 'Car + owner',      path: '/dashboard/hire/request' },
            { icon: 'person_pin',    label: 'Driver on Demand', sub: 'Your own car',    path: '/dashboard/m3/request' },
          ].map((m, i) => (
            <button key={i} onClick={() => m.path ? navigate(m.path) : alert('Coming soon!')}
              style={{ padding: '14px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', color: '#d3e4fe' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,219,231,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,219,231,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#00dbe7', display: 'block', marginBottom: 8 }}>{m.icon}</span>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>{m.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '16px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: s.color, marginBottom: 8, display: 'block' }}>{s.icon}</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.40)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* My Offers Button (Quick Link) */}
      <button onClick={() => navigate('/dashboard/hire/offers')}
        style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, cursor: 'pointer', transition: 'all 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,219,231,0.1)', color: '#00dbe7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined">local_activity</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>My Hire Offers</div>
            <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)' }}>Check your booking requests & driver offers</div>
          </div>
        </div>
        <span className="material-symbols-outlined" style={{ color: 'rgba(211,228,254,0.3)' }}>chevron_right</span>
      </button>

      {/* Recent Rides */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>Recent Rides</span>
          <span onClick={() => navigate('/dashboard/history')} style={{ fontSize: 12, color: '#00dbe7', cursor: 'pointer', fontWeight: 600 }}>View all →</span>
        </div>
        {recentRides.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(211,228,254,0.40)', fontSize: 13 }}>No recent rides</div>
        ) : (
          recentRides.map((r, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: i < recentRides.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,219,231,0.07)', border: '1px solid rgba(0,219,231,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#00dbe7' }}>route</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#d3e4fe' }}>{r.from} → {r.to}</div>
                  <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>{r.type} · {r.date}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#00dbe7' }}>{r.fare}</div>
                <div style={{ fontSize: 10, color: '#22d3a0', marginTop: 2, fontWeight: 600, textTransform: 'uppercase' }}>{r.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
