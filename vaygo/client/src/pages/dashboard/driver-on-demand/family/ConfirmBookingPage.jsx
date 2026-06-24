import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiPost } from '../../../../utils/api';

export default function ConfirmBookingPage() {
  const { id } = useParams(); // this is the driver id, but we need the requestId. Assuming mocked logic here for UI.
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mocked state
  const estTotal = 600;
  const advance = 180; // 30%

  const handleConfirm = async () => {
    setLoading(true);
    // Real implementation would pass requestId
    // Mocking an alert for MVP
    alert('Mock confirming booking and paying advance...');
    setTimeout(() => {
      setLoading(false);
      navigate(`/dashboard/m3/track/mock_booking_id`);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Split Payment Confirmation</h2>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ fontSize: 16, color: 'rgba(211,228,254,0.6)', marginBottom: 16 }}>PAYMENT BREAKDOWN</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15, color: '#d3e4fe' }}>
          <span>Estimated Total Trip Cost</span>
          <span style={{ fontWeight: 700 }}>₹{estTotal}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 15, color: '#00dbe7', fontWeight: 700 }}>
          <span>Advance Payment (30%)</span>
          <span>₹{advance}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 13, color: 'rgba(211,228,254,0.5)' }}>
          <span>Balance due after trip ends (70%)</span>
          <span>₹{estTotal - advance}</span>
        </div>
      </div>

      <button onClick={handleConfirm} disabled={loading} style={{ width: '100%', marginTop: 24, padding: 16, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Processing...' : `Pay ₹${advance} Advance`}
      </button>
    </div>
  );
}
