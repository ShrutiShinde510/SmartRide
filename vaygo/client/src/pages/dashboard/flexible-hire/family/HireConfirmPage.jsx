import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

export default function HireConfirmPage() {
  const navigate = useNavigate();
  const { hireId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const agreedPrice = parseInt(searchParams.get('price')) || 3000;
  const advancePayment = agreedPrice * 0.2;
  const carModel = searchParams.get('car') || 'Flexible Vehicle';
  const ownerName = searchParams.get('owner') || 'Your Driver';
  const tripDate = searchParams.get('date') ? new Date(searchParams.get('date')).toLocaleDateString() : 'Tomorrow';

  const [driverPhone, setDriverPhone] = useState(searchParams.get('phone') || 'Loading...');

  useEffect(() => {
    async function fetchPhone() {
      try {
        if (!hireId) return;
        const { ok, data } = await apiGet(`/api/auth/flexible-drivers/${hireId}`);
        if (ok && data.success && data.driver?.personal_info?.phone) {
          setDriverPhone(`+91 ${data.driver.personal_info.phone}`);
        }
      } catch (err) {
        console.error('Failed to fetch driver phone', err);
      }
    }
    fetchPhone();
  }, [hireId]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      
      {/* Success Animation */}
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,211,160,0.15)', border: '2px solid rgba(34,211,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px rgba(34,211,160,0.2)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#22d3a0' }}>check_circle</span>
      </div>

      <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Booking Confirmed!</div>
      <div style={{ fontSize: 14, color: 'rgba(211,228,254,0.6)', marginBottom: 40 }}>Your advance payment of ₹{advancePayment} was successful.</div>

      {/* QR Code Area */}
      <div style={{ background: '#fff', borderRadius: 24, padding: 32, display: 'inline-block', marginBottom: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        {/* Mock QR Code image (using a generic QR placeholder from wikimedia or just CSS squares) */}
        <div style={{ width: 200, height: 200, background: 'url(https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg) center/cover no-repeat', marginBottom: 20 }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Show this QR to the driver to start the trip.</div>
        <div style={{ fontSize: 11, color: '#666', marginTop: 8 }}>Or share OTP: <strong style={{ fontSize: 18, color: '#000' }}>4812</strong></div>
      </div>

      {/* Details Card */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, textAlign: 'left', marginBottom: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,219,231,0.8)', marginBottom: 16, letterSpacing: '0.5px' }}>DRIVER DETAILS</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)' }}>Driver Name</span>
          <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{ownerName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)' }}>Phone Number</span>
          <span style={{ fontSize: 14, color: '#22d3a0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>call</span> {driverPhone}
          </span>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0 -20px 16px', paddingTop: 16, paddingLeft: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,219,231,0.8)', marginBottom: 16, letterSpacing: '0.5px' }}>VEHICLE DETAILS</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)' }}>Vehicle Model</span>
          <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{carModel}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)' }}>License Plate</span>
          <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 800, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4 }}>MH 01 AB 1234</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)' }}>Color / Type</span>
          <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>White / Sedan</span>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0 -20px 16px', paddingTop: 16, paddingLeft: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,219,231,0.8)', marginBottom: 16, letterSpacing: '0.5px' }}>TRIP SCHEDULE</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)' }}>Date</span>
          <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{tripDate}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, marginBottom: 16, opacity: 0.7 }}>
        <span className="material-symbols-outlined" style={{ color: '#fbbf24' }}>location_disabled</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>Live Tracking Unavailable</div>
          <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)' }}>Tracking will activate when the driver starts the trip</div>
        </div>
      </div>
      <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', color: '#d3e4fe', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        Back to Dashboard
      </button>

    </div>
  );
}
