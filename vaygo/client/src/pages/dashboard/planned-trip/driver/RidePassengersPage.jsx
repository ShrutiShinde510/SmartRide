import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

const PASSENGERS = [
  { id: 'P-1', name: 'Rohan Gupta', seats: 1, pickup: 'Pune Station', drop: 'Dadar', status: 'Boarded', phone: '+91 98765 43210' },
  { id: 'P-2', name: 'Sneha Kulkarni', seats: 2, pickup: 'Hinjewadi', drop: 'Bandra', status: 'Waiting', phone: '+91 91234 56789' },
];

export default function RidePassengersPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPassengers() {
      const { ok, data } = await apiGet(`/api/bookings/ride/${rideId}`);
      if (ok && data.success) {
        setPassengers(data.passengers);
      }
      setLoading(false);
    }
    fetchPassengers();
  }, [rideId]);

  // Calculate stats based on bookings
  const seatsFilled = passengers.reduce((sum, p) => sum + p.seatsReserved, 0);
  const estEarnings = passengers.reduce((sum, p) => sum + p.totalFare, 0);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#d3e4fe' }}>Passenger Manifest</h2>
          <p style={{ fontSize: 12, color: '#00dbe7', marginTop: 2, fontFamily: 'monospace' }}>Trip {rideId}</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe' }}>{seatsFilled}</div>
          <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginTop: 4 }}>Seats Filled</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(0,219,231,0.05)', border: '1px solid rgba(0,219,231,0.2)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#00dbe7' }}>₹{estEarnings}</div>
          <div style={{ fontSize: 12, color: 'rgba(0,219,231,0.7)', marginTop: 4 }}>Est. Earnings</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>Loading passenger manifest...</div>
        ) : passengers.length === 0 ? (
          <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>No passengers have booked yet.</div>
        ) : (
          passengers.map(p => (
            <div key={p._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.15),rgba(0,241,254,0.05))', border: '1px solid rgba(0,219,231,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#00dbe7' }}>person</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>{p.passengerId?.personal_info?.full_name || p.passengerId?.full_name || 'Passenger'}</div>
                    <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginTop: 2 }}>{p.seatsReserved} Seat{p.seatsReserved > 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: p.boardingStatus === 'Boarded' ? 'rgba(0,219,231,0.1)' : 'rgba(255,165,0,0.1)', color: p.boardingStatus === 'Boarded' ? '#00dbe7' : '#ffb84d' }}>
                  {p.boardingStatus}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 12, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#d3e4fe' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(211,228,254,0.4)' }}>phone</span>
                  <span style={{ color: 'rgba(211,228,254,0.5)', width: 40 }}>Phone:</span>
                  <strong>{p.passengerId?.personal_info?.phone || p.passengerId?.phone || 'N/A'}</strong>
                </div>
              </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate(`/driver-dashboard/booking/${p._id}/chat`)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#d3e4fe', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span> Chat
              </button>
              <a href={p.passengerId?.personal_info?.phone || p.passengerId?.phone ? `tel:${p.passengerId?.personal_info?.phone || p.passengerId?.phone}` : '#'}
                  onClick={(e) => {
                    if (!(p.passengerId?.personal_info?.phone || p.passengerId?.phone)) {
                      e.preventDefault();
                      alert('Phone number not available');
                    }
                  }} style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(0,219,231,0.1)', color: '#00dbe7', border: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>call</span> Call
                </a>
            </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
