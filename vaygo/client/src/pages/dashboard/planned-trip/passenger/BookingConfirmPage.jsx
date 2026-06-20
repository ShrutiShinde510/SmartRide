import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

export default function BookingConfirmPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      const { ok, data } = await apiGet(`/api/bookings/${bookingId}`);
      if (ok && data.success) {
        setBooking(data.booking);
      }
    }
    fetchBooking();
  }, [bookingId]);

  if (!booking) return <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>Loading booking confirmation...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      
      {/* Success Animation */}
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,219,231,0.1)', border: '2px solid #00dbe7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#00dbe7' }}>check</span>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#d3e4fe', marginBottom: 8 }}>Booking Confirmed!</h2>
      <p style={{ fontSize: 14, color: 'rgba(211,228,254,0.6)', marginBottom: 32 }}>Your ride with {booking.rideId?.driverId?.personal_info?.full_name || 'the driver'} is locked in.</p>

      {/* Ticket / QR Code Card */}
      <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden', marginBottom: 32 }}>
        
        {/* Decorative cutouts for ticket look */}
        <div style={{ position: 'absolute', top: '50%', left: -16, width: 32, height: 32, borderRadius: '50%', background: '#020e1c', transform: 'translateY(-50%)', borderRight: '1px solid rgba(255,255,255,0.08)' }}></div>
        <div style={{ position: 'absolute', top: '50%', right: -16, width: 32, height: 32, borderRadius: '50%', background: '#020e1c', transform: 'translateY(-50%)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}></div>
        
        {/* Dotted separator */}
        <div style={{ position: 'absolute', top: '50%', left: 24, right: 24, borderTop: '2px dashed rgba(255,255,255,0.1)' }}></div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>Booking ID</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#00dbe7', fontFamily: 'monospace' }}>{booking._id.slice(-8).toUpperCase()}</div>
        </div>

        {/* QR Code mock */}
        <div style={{ background: '#fff', padding: 16, borderRadius: 16, display: 'inline-block', marginBottom: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 100, color: '#000', display: 'block' }}>qr_code_2</span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)' }}>Show this QR code to the driver to board</div>

      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => navigate(`/dashboard/booking/${bookingId}/track`)}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,219,231,0.2)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>location_on</span>
          Track Driver Live
        </button>
        <button onClick={() => navigate('/dashboard/home')}
          style={{ width: '100%', padding: '16px', background: 'transparent', color: '#d3e4fe', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Back to Home
        </button>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
