import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { apiGet, apiPost } from '../../../../utils/api';

export default function PaymentPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seats = parseInt(searchParams.get('seats') || '1', 10);

  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    async function fetchRide() {
      const { ok, data } = await apiGet(`/api/rides/${rideId}`);
      if (ok && data.success) {
        setRide(data.ride);
      }
    }
    fetchRide();
  }, [rideId]);

  const handlePay = async () => {
    setProcessing(true);
    
    // 1. Create booking
    const { ok: createOk, data: createData } = await apiPost('/api/bookings', { rideId, seats });
    if (!createOk || !createData.success) {
      alert(createData.message || 'Failed to create booking');
      setProcessing(false);
      return;
    }

    // 2. Process payment mock
    const bookingId = createData.bookingId;
    const { ok: payOk } = await apiPost(`/api/bookings/${bookingId}/pay`);
    
    if (payOk) {
      navigate(`/dashboard/booking/${bookingId}/confirm`);
    } else {
      alert('Payment failed');
      setProcessing(false);
    }
  };

  if (!ride) return <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>Loading payment details...</div>;

  const seatPrice = ride.pricePerSeat * seats;
  const platformFee = 25;
  const taxes = seatPrice * 0.05;
  const total = seatPrice + platformFee + taxes;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#d3e4fe' }}>Complete Payment</h2>
      </div>

      {/* Fare Breakdown */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>Fare Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(211,228,254,0.6)' }}>
            <span>Seat Price ({seats} Passenger{seats > 1 ? 's' : ''})</span>
            <span>₹{seatPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(211,228,254,0.6)' }}>
            <span>Platform Fee</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(211,228,254,0.6)' }}>
            <span>Taxes (GST 5%)</span>
            <span>₹{taxes.toFixed(2)}</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#d3e4fe', fontWeight: 800 }}>
            <span>Total to Pay</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>Select Payment Method</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        
        {/* UPI */}
        <div style={{ background: method === 'upi' ? 'rgba(0,219,231,0.05)' : 'rgba(255,255,255,0.02)', border: method === 'upi' ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', transition: 'all 0.3s' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="material-symbols-outlined" style={{ color: method === 'upi' ? '#00dbe7' : 'rgba(211,228,254,0.4)', fontSize: 24 }}>qr_code_scanner</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#d3e4fe' }}>UPI / QR</div>
                <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.4)', marginTop: 2 }}>GPay, PhonePe, Paytm</div>
              </div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: method === 'upi' ? '6px solid #00dbe7' : '2px solid rgba(255,255,255,0.2)' }}></div>
            <input type="radio" name="payment" value="upi" checked={method === 'upi'} onChange={() => setMethod('upi')} style={{ display: 'none' }} />
          </label>
          {method === 'upi' && (
            <div style={{ padding: '0 16px 20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 140, height: 140, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0', padding: 8 }}>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=vaygo-payment" alt="UPI QR Code" style={{ width: '100%', height: '100%' }} />
              </div>
              <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.6)', textAlign: 'center' }}>Scan to pay with any UPI app</div>
            </div>
          )}
        </div>

        {/* Card */}
        <div style={{ background: method === 'card' ? 'rgba(0,219,231,0.05)' : 'rgba(255,255,255,0.02)', border: method === 'card' ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', transition: 'all 0.3s' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="material-symbols-outlined" style={{ color: method === 'card' ? '#00dbe7' : 'rgba(211,228,254,0.4)', fontSize: 24 }}>credit_card</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#d3e4fe' }}>Credit/Debit Card</div>
                <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.4)', marginTop: 2 }}>Visa, Mastercard, RuPay</div>
              </div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: method === 'card' ? '6px solid #00dbe7' : '2px solid rgba(255,255,255,0.2)' }}></div>
            <input type="radio" name="payment" value="card" checked={method === 'card'} onChange={() => setMethod('card')} style={{ display: 'none' }} />
          </label>
          {method === 'card' && (
            <div style={{ padding: '0 16px 20px 16px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
              <input type="text" placeholder="Card Number" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }} />
              <div style={{ display: 'flex', gap: 12 }}>
                <input type="text" placeholder="MM/YY" style={{ flex: 1, padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }} />
                <input type="text" placeholder="CVV" style={{ width: 100, padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }} />
              </div>
              <input type="text" placeholder="Name on Card" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }} />
            </div>
          )}
        </div>

        {/* Wallet */}
        <div style={{ background: method === 'wallet' ? 'rgba(0,219,231,0.05)' : 'rgba(255,255,255,0.02)', border: method === 'wallet' ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', transition: 'all 0.3s' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="material-symbols-outlined" style={{ color: method === 'wallet' ? '#00dbe7' : 'rgba(211,228,254,0.4)', fontSize: 24 }}>account_balance_wallet</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#d3e4fe' }}>Vaygo Wallet</div>
                <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.4)', marginTop: 2 }}>Available Balance: ₹450.00</div>
              </div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: method === 'wallet' ? '6px solid #00dbe7' : '2px solid rgba(255,255,255,0.2)' }}></div>
            <input type="radio" name="payment" value="wallet" checked={method === 'wallet'} onChange={() => setMethod('wallet')} style={{ display: 'none' }} />
          </label>
          {method === 'wallet' && (
            <div style={{ padding: '0 16px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,219,231,0.1)', borderRadius: 8, border: '1px dashed rgba(0,219,231,0.3)' }}>
                <span style={{ fontSize: 14, color: '#d3e4fe' }}>To be deducted:</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#00dbe7' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      <button onClick={handlePay} disabled={processing}
        style={{ width: '100%', padding: '16px', background: processing ? 'rgba(0,219,231,0.5)' : 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: processing ? 'none' : '0 8px 24px rgba(0,219,231,0.2)' }}>
        {processing ? (
          <>
            <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
            Processing Secure Payment...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>lock</span>
            Pay ₹{total.toFixed(2)} securely
          </>
        )}
      </button>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
