import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const seats = searchParams.get('seats') || 1;

  useEffect(() => {
    async function searchRides() {
      const query = new URLSearchParams({ from, to, date, seats }).toString();
      const { ok, data } = await apiGet(`/api/rides?${query}`);
      if (ok && data.success) {
        setRides(data.rides);
      }
      setLoading(false);
    }
    searchRides();
  }, [from, to, date, seats]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe' }}>{from || 'Anywhere'} <span style={{ color: 'rgba(211,228,254,0.4)', margin: '0 4px' }}>→</span> {to || 'Anywhere'}</div>
          <div style={{ fontSize: 12, color: '#00dbe7', marginTop: 2, fontWeight: 600 }}>{date ? new Date(date).toLocaleDateString() : 'Any date'} • {seats} Passenger{seats > 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Date Filters / Tabs */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
        {['Today', 'Tomorrow', 'Jun 21'].map(d => (
          <button key={d} style={{ padding: '8px 16px', borderRadius: 99, background: d === 'Today' ? 'rgba(0,219,231,0.1)' : 'transparent', border: d === 'Today' ? '1px solid rgba(0,219,231,0.3)' : '1px solid rgba(255,255,255,0.1)', color: d === 'Today' ? '#00dbe7' : 'rgba(211,228,254,0.5)', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {d}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>Searching for rides...</div>
        ) : rides.length === 0 ? (
          <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>No rides found for this route.</div>
        ) : (
          rides.map(ride => (
            <div key={ride._id} onClick={() => navigate(`/dashboard/ride/${ride._id}?seats=${seats}`)}
              style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,219,231,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,219,231,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
            
            {/* Tag */}
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,219,231,0.1)', color: '#00dbe7', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderBottomLeftRadius: 12, textTransform: 'uppercase' }}>
              Available
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.15),rgba(0,241,254,0.05))', border: '1px solid rgba(0,219,231,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#00dbe7' }}>person</span>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>{ride.driverId?.personal_info?.full_name || 'Driver'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#fbbf24', marginTop: 2, fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>star</span> {ride.driverId?.rating || '4.8'}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#00dbe7' }}>₹{ride.pricePerSeat}</div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#d3e4fe', fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(211,228,254,0.4)' }}>schedule</span> {new Date(ride.date).toLocaleDateString()} • {ride.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(211,228,254,0.6)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(211,228,254,0.4)' }}>directions_car</span> {ride.driverId?.personal_info?.vehicle?.model || 'Car'}
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 6 }}>
                {ride.capacity - ride.bookedSeats} seat{(ride.capacity - ride.bookedSeats) > 1 ? 's' : ''} left
              </div>
            </div>

          </div>
        ))
        )}
      </div>

    </div>
  );
}
