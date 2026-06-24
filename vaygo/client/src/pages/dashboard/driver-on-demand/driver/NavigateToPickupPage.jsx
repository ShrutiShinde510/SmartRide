import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../../../utils/api';

export default function NavigateToPickupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    apiGet(`/api/m3/request/${id}`).then(({ ok, data }) => {
      if (ok && data.success) {
        setRequest(data.request);
        setBooking(data.booking);
      }
    });
  }, [id]);

  const handleStartTrip = async () => {
    if (!booking) return alert('Booking data not loaded yet');
    try {
      const { ok, data } = await apiPost('/api/m3/booking/start-trip', { bookingId: booking._id });
      if (ok && data.success) {
        navigate(`/driver-dashboard/m3/active/${id}`);
      } else {
        alert(data.message || 'Failed to start trip');
      }
    } catch (err) {
      alert('Error starting trip');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '80vh' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 8 }}>Navigate to Family</h2>
      {request && (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#00dbe7' }}>{request.familyId?.personal_info?.full_name}</div>
          <div style={{ fontSize: 14, color: 'rgba(211,228,254,0.7)', marginTop: 4 }}>Phone: {request.familyId?.personal_info?.phone}</div>
          <div style={{ fontSize: 14, color: 'rgba(211,228,254,0.7)', marginTop: 4 }}>Pickup: {request.pickupLocation}</div>
          <div style={{ fontSize: 14, color: 'rgba(211,228,254,0.7)', marginTop: 4 }}>Car: {request.carDetails?.brand} {request.carDetails?.model} ({request.carDetails?.transmission})</div>
        </div>
      )}
      
      <div style={{ flex: 1, background: 'radial-gradient(circle, rgba(0,219,231,0.05) 10%, transparent 80%), #051a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(0,219,231,0.25)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>navigation</span>
        <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(3,20,39,0.8)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)' }}>15 mins away</div>
          <div style={{ fontSize: 14, color: '#00dbe7', fontWeight: 700 }}>Routing to pickup...</div>
        </div>
      </div>

      <button onClick={handleStartTrip} style={{ marginTop: 24, padding: 16, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
        Arrived - Start Trip
      </button>
    </div>
  );
}
