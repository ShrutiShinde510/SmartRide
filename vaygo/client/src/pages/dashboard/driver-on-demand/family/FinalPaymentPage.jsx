import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function FinalPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const balance = 420; // Mock 70% balance

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/dashboard/m3/rate/${id}`);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Final Payment</h2>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ fontSize: 16, color: 'rgba(211,228,254,0.6)', marginBottom: 16 }}>BALANCE DUE</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 20, color: '#00dbe7', fontWeight: 800 }}>
          <span>Final Payment (70%)</span>
          <span>₹{balance}</span>
        </div>
      </div>

      <button onClick={handlePay} disabled={loading} style={{ width: '100%', marginTop: 24, padding: 16, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Processing...' : `Pay ₹${balance}`}
      </button>
    </div>
  );
}
