import { useState } from 'react';


const FILTER_OPTIONS = ['All', 'Planned Trip', 'Flexible Hire', 'Driver on Demand'];

export default function HistoryPage() {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = rides.filter(r => {
    const matchType = filter === 'All' || r.type === filter;
    const matchSearch = !search || r.from.toLowerCase().includes(search.toLowerCase()) || r.to.toLowerCase().includes(search.toLowerCase()) || r.driver.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const totalSpent = filtered.reduce((s, r) => s + parseInt(r.fare.replace(/[₹,]/g, '')), 0);
  const totalKm    = filtered.reduce((s, r) => s + r.km, 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>Ride History</div>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 24 }}>All your past trips at a glance</div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Rides',  value: filtered.length, icon: 'directions_car', color: '#00dbe7' },
          { label: 'Total Spent',  value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: 'payments', color: '#74f5ff' },
          { label: 'Total KM',     value: `${totalKm} km`, icon: 'route',          color: '#22d3a0' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.40)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(211,228,254,0.35)' }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by place or driver..."
            style={{ width: '100%', padding: '10px 14px 10px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTER_OPTIONS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 14px', borderRadius: 8, background: filter === f ? 'rgba(0,219,231,0.10)' : 'rgba(255,255,255,0.03)', border: filter === f ? '1px solid rgba(0,219,231,0.22)' : '1px solid rgba(255,255,255,0.07)', color: filter === f ? '#00dbe7' : 'rgba(211,228,254,0.50)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Rides List */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'rgba(211,228,254,0.25)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, marginBottom: 10, display: 'block' }}>history</span>
            No rides found
          </div>
        ) : (
          filtered.map((r, i) => (
            <div key={i} style={{ padding: '15px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(0,219,231,0.06)', border: '1px solid rgba(0,219,231,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#00dbe7' }}>route</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#d3e4fe' }}>{r.from} → {r.to}</div>
                  <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>{r.driver} · {r.type} · {r.km} km</div>
                  <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.30)', marginTop: 1 }}>{r.date}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#00dbe7' }}>{r.fare}</div>
                <div style={{ fontSize: 11, color: '#fbbf24', marginTop: 3 }}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
