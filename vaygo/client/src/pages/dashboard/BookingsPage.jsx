import { useState } from 'react';

const TABS = ['Active', 'Upcoming', 'Completed'];



const STATUS_COLOR = { Active: '#22d3a0', Upcoming: '#fbbf24', Completed: 'rgba(211,228,254,0.35)' };
const TYPE_ICON = { 'Planned Trip': 'schedule', 'Flexible Hire': 'directions_car', 'Driver on Demand': 'person_pin' };

export default function BookingsPage() {
  const [tab, setTab] = useState('Active');
  const [data, setData] = useState({ Active: [], Upcoming: [], Completed: [] });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>My Bookings</div>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 24 }}>Track and manage all your ride bookings</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 12, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 9, background: tab === t ? 'rgba(0,219,231,0.10)' : 'transparent', color: tab === t ? '#00dbe7' : 'rgba(211,228,254,0.50)', border: tab === t ? '1px solid rgba(0,219,231,0.20)' : '1px solid transparent', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
            {t}
            <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 6px', borderRadius: 99, background: tab === t ? 'rgba(0,219,231,0.15)' : 'rgba(255,255,255,0.06)', color: tab === t ? '#00dbe7' : 'rgba(211,228,254,0.35)' }}>
              {data[t].length}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {data[tab].length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(211,228,254,0.25)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12, display: 'block' }}>calendar_month</span>
          No {tab.toLowerCase()} bookings
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data[tab].map((b, i) => (
            <div key={i} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              {/* Top bar */}
              {tab === 'Active' && (
                <div style={{ padding: '8px 18px', background: 'rgba(34,211,160,0.06)', borderBottom: '1px solid rgba(34,211,160,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3a0', boxShadow: '0 0 8px #22d3a0', animation: 'glowPulse 2s infinite' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#22d3a0' }}>LIVE · Driver {b.eta}</span>
                </div>
              )}
              <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(0,219,231,0.07)', border: '1px solid rgba(0,219,231,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#00dbe7' }}>{TYPE_ICON[b.type]}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>{b.route}</div>
                    <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', marginTop: 3 }}>Driver: {b.driver} · {b.type}</div>
                    <div style={{ fontSize: 11, color: STATUS_COLOR[tab], marginTop: 4, fontWeight: 600 }}>{b.time}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#00dbe7', marginBottom: 8 }}>{b.fare}</div>
                  {tab === 'Active' && (
                    <button style={{ padding: '6px 12px', background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.20)', borderRadius: 7, color: '#00dbe7', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      Track
                    </button>
                  )}
                  {tab === 'Upcoming' && (
                    <button style={{ padding: '6px 12px', background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.15)', borderRadius: 7, color: 'rgba(255,130,130,0.80)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  )}
                  {tab === 'Completed' && (
                    <div style={{ fontSize: 10, color: '#22d3a0', fontWeight: 700 }}>✓ Done</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
