import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

const MOCK_RIDES = [
  { id: 'R-7721', route: 'Pune → Mumbai', date: 'Today, 08:30 AM', booked: 3, capacity: 4, revenue: '₹1,050', status: 'Upcoming' },
  { id: 'R-7604', route: 'Mumbai → Pune', date: 'Yesterday, 06:00 PM', booked: 4, capacity: 4, revenue: '₹1,400', status: 'Completed' },
];

export default function ManageRidesPage() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRides() {
      const { ok, data } = await apiGet('/api/rides/driver');
      if (ok && data.success) {
        setRides(data.rides);
      }
      setLoading(false);
    }
    fetchRides();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/driver-dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer', flexShrink: 0 }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px' }}>Manage Rides</h2>
            <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginTop: 4 }}>Track your scheduled trips and passenger bookings</p>
          </div>
        </div>
        <button onClick={() => navigate('/driver-dashboard/create-ride')} style={{ background: 'rgba(0,219,231,0.1)', border: '1px solid rgba(0,219,231,0.3)', padding: '10px 16px', borderRadius: 10, color: '#00dbe7', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Post Ride
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>Loading your rides...</div>
        ) : rides.length === 0 ? (
          <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>You haven't posted any rides yet.</div>
        ) : (
          rides.map(ride => (
            <div key={ride._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: ride.status === 'Upcoming' ? 'rgba(0,219,231,0.1)' : 'rgba(255,255,255,0.05)', color: ride.status === 'Upcoming' ? '#00dbe7' : 'rgba(211,228,254,0.5)', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                  {ride.status}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.4)', fontFamily: 'monospace' }}>ID: {ride._id.slice(-6).toUpperCase()}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#00dbe7' }}>₹{ride.bookedSeats * ride.pricePerSeat}</div>
            </div>

            {/* Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#d3e4fe', marginBottom: 4 }}>{ride.from} → {ride.to}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(211,228,254,0.6)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span> {new Date(ride.date).toLocaleDateString()} • {ride.time}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginBottom: 4 }}>Seats Booked</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: ride.bookedSeats === ride.capacity ? '#fbbf24' : '#d3e4fe' }}>
                    {ride.bookedSeats} / {ride.capacity}
                  </div>
                </div>
                
                {/* Actions */}
                {ride.status === 'Upcoming' && (
                  <button onClick={() => navigate(`/driver-dashboard/ride/${ride._id}/passengers`)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.15),rgba(0,241,254,0.05))', border: '1px solid rgba(0,219,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00dbe7', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined">group</span>
                  </button>
                )}
              </div>
            </div>

            {/* Start Trip CTA */}
            {ride.status === 'Upcoming' && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, marginTop: 4 }}>
                <button onClick={() => navigate(`/driver-dashboard/ride/${ride._id}/navigate`)} style={{ width: '100%', padding: '12px', background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.3)', borderRadius: 10, color: '#00dbe7', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>navigation</span> Start Navigation
                </button>
              </div>
            )}

          </div>
        )))}
      </div>

    </div>
  );
}
