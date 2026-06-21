import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { apiPost } from '../../../../utils/api';

export default function HirePaymentPage() {
  const navigate = useNavigate();
  const { hireId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const agreedPrice = parseInt(searchParams.get('price')) || 3000;
  const carModel = searchParams.get('car') || 'Flexible Vehicle';
  const fromLoc = searchParams.get('from') || 'Pickup';
  const toLoc = searchParams.get('to') || 'Drop';
  const advancePayment = agreedPrice * 0.2; // 20% advance
  
  const [method, setMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    
    try {
      const { ok, data } = await apiPost(`/api/hires/${hireId}/pay`);
      
      if (ok && data.success) {
        navigate(`/dashboard/hire/confirm/${hireId || '123'}${location.search}`);
      } else {
        alert(data?.message || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Something went wrong during payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px', paddingBottom: 100 }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe' }}>Secure Checkout</div>
      </div>

      {/* Trip Summary */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>TRIP SUMMARY</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'rgba(211,228,254,0.6)' }}>Vehicle</span>
          <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{carModel}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'rgba(211,228,254,0.6)' }}>Route</span>
          <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{fromLoc} to {toLoc}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'rgba(211,228,254,0.6)' }}>Agreed Total Price</span>
          <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>₹{agreedPrice}</span>
        </div>
        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fbbf24' }}>Advance Payment</div>
            <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginTop: 2 }}>20% required to confirm booking</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fbbf24' }}>₹{advancePayment}</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>Select Payment Method</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', icon: 'qr_code_scanner' },
          { id: 'card', name: 'Credit / Debit Card', icon: 'credit_card' },
        ].map(m => (
          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div onClick={() => setMethod(m.id)}
              style={{ padding: '16px', borderRadius: 12, border: method === m.id ? '2px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', background: method === m.id ? 'rgba(0,219,231,0.05)' : 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all 0.2s' }}>
              <span className="material-symbols-outlined" style={{ color: method === m.id ? '#00dbe7' : 'rgba(211,228,254,0.5)' }}>{m.icon}</span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: method === m.id ? '#d3e4fe' : 'rgba(211,228,254,0.6)' }}>{m.name}</span>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: method === m.id ? '6px solid #00dbe7' : '2px solid rgba(255,255,255,0.2)' }} />
            </div>
            
            {/* Payment Details Form */}
            {method === m.id && (
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', marginTop: 4, animation: 'fadeIn 0.3s ease-out' }}>
                {method === 'upi' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.6)', marginBottom: 8 }}>Enter your UPI ID</label>
                    <input type="text" placeholder="e.g. username@okhdfcbank" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
                  </div>
                )}
                {method === 'card' && (
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.6)', marginBottom: 8 }}>Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.6)', marginBottom: 8 }}>Expiry (MM/YY)</label>
                        <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.6)', marginBottom: 8 }}>CVV</label>
                        <input type="password" placeholder="123" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'rgba(10, 15, 30, 0.95)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <button onClick={handlePay} disabled={isProcessing} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: isProcessing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(0,219,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isProcessing ? 0.8 : 1 }}>
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
                Processing Payment...
              </>
            ) : (
              <>
                Pay ₹{advancePayment} Securely <span className="material-symbols-outlined">lock</span>
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
