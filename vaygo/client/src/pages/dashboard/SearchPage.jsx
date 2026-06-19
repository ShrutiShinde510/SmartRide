import { useState } from 'react';

const MODES = [
  { id: 'planned', icon: 'schedule',       label: '🚗 Planned Trip',      desc: 'Book a seat on a scheduled carpool route' },
  { id: 'hire',    icon: 'directions_car', label: '🚙 Flexible Hire',     desc: 'Hire a car owner for the day or trip' },
  { id: 'driver',  icon: 'person_pin',     label: '👨‍✈️ Driver on Demand', desc: 'Trusted driver for your own vehicle' },
];

const MOCK_RESULTS = {
  planned: [
    { driver: 'Amit Verma',   route: 'Nashik → Pune',    time: '08:00 AM', seats: 2, fare: '₹320', rating: 4.8 },
    { driver: 'Rohit Sharma', route: 'Nashik → Mumbai',  time: '06:30 AM', seats: 3, fare: '₹480', rating: 4.9 },
  ],
  hire: [
    { driver: 'Sanjay More',  route: 'Local – Full Day', time: 'Immediate', seats: 4, fare: '₹1,200', rating: 4.7 },
    { driver: 'Priya Patil',  route: 'Nashik to Shirdi',  time: 'On request', seats: 5, fare: '₹1,800', rating: 4.95 },
  ],
  driver: [
    { driver: 'Rahul Joshi',  route: 'Drive your car',   time: '6 hrs shift', seats: 1, fare: '₹900', rating: 4.85 },
    { driver: 'Kavita Desai', route: 'Outstation trip',  time: 'Negotiate',   seats: 1, fare: '₹1,500', rating: 4.9 },
  ],
};

export default function SearchPage() {
  const [mode, setMode] = useState('planned');
  const [from, setFrom] = useState('');
  const [to, setTo]     = useState('');
  const [date, setDate] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSearched(true); }, 1000);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>Find a Ride</div>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 24 }}>Search across all three Vaygo travel models</div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 12 }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setSearched(false); }}
            style={{ flex: 1, padding: '10px 6px', borderRadius: 9, background: mode === m.id ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'transparent', color: mode === m.id ? '#002022' : 'rgba(211,228,254,0.55)', border: 'none', fontWeight: 700, fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)', marginBottom: 14 }}>{MODES.find(m => m.id === mode)?.desc}</div>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* From */}
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#00dbe7' }}>trip_origin</span>
              <input value={from} onChange={e => setFrom(e.target.value)} placeholder="From city / area" required
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
            </div>
            {/* To */}
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#ff6b6b' }}>location_on</span>
              <input value={to} onChange={e => setTo(e.target.value)} placeholder="To city / destination" required
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
            </div>
          </div>
          {/* Date */}
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: date ? '#d3e4fe' : 'rgba(211,228,254,0.35)', fontSize: 13, outline: 'none', colorScheme: 'dark' }} />
          <button type="submit" disabled={loading}
            style={{ padding: '13px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 18px rgba(0,219,231,0.20)', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Searching...' : '🔍 Search Rides'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(211,228,254,0.50)', marginBottom: 14, letterSpacing: '0.05em' }}>
            {MOCK_RESULTS[mode].length} RESULTS FOUND
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_RESULTS[mode].map((r, i) => (
              <div key={i} style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,rgba(0,219,231,0.10),rgba(0,100,120,0.08))', border: '1px solid rgba(0,219,231,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#00dbe7' }}>person</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>{r.driver}</div>
                    <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', marginTop: 2 }}>{r.route} · {r.time}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#fbbf24' }}>★ {r.rating}</span>
                      <span style={{ fontSize: 11, color: 'rgba(211,228,254,0.30)' }}>·</span>
                      <span style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)' }}>{r.seats} seat{r.seats > 1 ? 's' : ''} available</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#00dbe7', marginBottom: 8 }}>{r.fare}</div>
                  {booked === i ? (
                    <span style={{ fontSize: 12, color: '#22d3a0', fontWeight: 700 }}>✓ Booked!</span>
                  ) : (
                    <button onClick={() => setBooked(i)}
                      style={{ padding: '7px 16px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
