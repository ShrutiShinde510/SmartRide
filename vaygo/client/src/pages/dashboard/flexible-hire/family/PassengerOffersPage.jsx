import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

export default function PassengerOffersPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const { ok, data } = await apiGet('/api/hires/my-requests');
        if (ok && data.success) {
          const mapped = data.requests.map(req => ({
            id: req._id,
            ownerId: req.ownerId?._id,
            ownerName: req.ownerId?.personal_info?.full_name || 'Driver',
            ownerPhone: req.ownerId?.personal_info?.phone || '',
            carModel: `${req.ownerId?.vehicle?.brand || ''} ${req.ownerId?.vehicle?.model || 'Car'}`.trim(),
            from: req.from,
            to: req.to,
            date: req.date,
            passengers: req.passengers,
            status: req.status,
            finalPrice: req.finalPrice || 0
          }));
          setRequests(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch requests', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px', paddingBottom: 100 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px' }}>My Hire Requests</div>
          <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 2 }}>Track your booking requests and view offers from drivers</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'rgba(211,228,254,0.5)' }}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(0,219,231,0.2)', marginBottom: 12 }}>inbox</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe' }}>No Requests Found</div>
            <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 6 }}>You haven't requested any flexible cars yet.</div>
            <button onClick={() => navigate('/dashboard/hire/request')} style={{ marginTop: 20, padding: '12px 24px', background: 'rgba(0,219,231,0.1)', border: '1px solid rgba(0,219,231,0.2)', borderRadius: 12, color: '#00dbe7', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Search Cars</button>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden' }}>
              
              {/* Status Ribbon */}
              <div style={{ position: 'absolute', top: 16, right: -30, background: req.status === 'offer_sent' ? '#22d3a0' : req.status === 'rejected' ? '#ff4d4d' : 'rgba(255,255,255,0.1)', color: req.status === 'pending' ? '#fff' : '#002022', fontSize: 10, fontWeight: 800, padding: '4px 32px', transform: 'rotate(45deg)', letterSpacing: '0.5px' }}>
                {req.status === 'offer_sent' ? 'OFFER RECEIVED' : req.status === 'rejected' ? 'DECLINED' : 'PENDING'}
              </div>

              {/* Driver Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.1),rgba(0,241,254,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,219,231,0.2)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#00dbe7' }}>directions_car</span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#d3e4fe' }}>{req.carModel}</div>
                  <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 2 }}>Driver: {req.ownerName}</div>
                </div>
              </div>

              {/* Trip Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginBottom: 2 }}>From</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#d3e4fe' }}>{req.from}</div>
                </div>
                <span className="material-symbols-outlined" style={{ color: 'rgba(211,228,254,0.2)' }}>arrow_forward</span>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginBottom: 2 }}>To</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#d3e4fe' }}>{req.to}</div>
                </div>
              </div>

              {/* Date & Pax */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span> {new Date(req.date).toLocaleDateString()}</div>
                <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>group</span> {req.passengers} Passengers</div>
              </div>

              {/* Dynamic Action Area based on status */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, marginTop: 4 }}>
                {req.status === 'pending' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ color: '#fbbf24', animation: 'spin 2s linear infinite' }}>hourglass_empty</span>
                    <div style={{ fontSize: 13, color: '#fbbf24', fontWeight: 600 }}>Waiting for driver to review request...</div>
                  </div>
                )}
                
                {req.status === 'rejected' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ color: '#ff4d4d' }}>cancel</span>
                    <div style={{ fontSize: 13, color: '#ff4d4d', fontWeight: 600 }}>The driver is currently unavailable for this trip.</div>
                  </div>
                )}

                {req.status === 'offer_sent' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.5)', fontWeight: 600, marginBottom: 2 }}>FINAL PRICE OFFER</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#00dbe7' }}>₹{req.finalPrice}</div>
                    </div>
                    <button onClick={() => navigate(`/dashboard/hire/payment/${req.id}?price=${req.finalPrice}&car=${encodeURIComponent(req.carModel)}&from=${encodeURIComponent(req.from)}&to=${encodeURIComponent(req.to)}&owner=${encodeURIComponent(req.ownerName)}&phone=${encodeURIComponent(req.ownerPhone || '+91 90000 00000')}&date=${encodeURIComponent(req.date)}`)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', border: 'none', borderRadius: 12, color: '#002022', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,219,231,0.3)' }}>
                      Accept & Book
                    </button>
                  </div>
                )}

                {req.status === 'confirmed' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="material-symbols-outlined" style={{ color: '#22d3a0' }}>check_circle</span>
                      <div style={{ fontSize: 13, color: '#22d3a0', fontWeight: 600 }}>Booking Confirmed. Waiting for driver to start...</div>
                    </div>
                    <button onClick={() => navigate(`/dashboard/hire/track/${req.id}`)} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#d3e4fe', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                      View Details
                    </button>
                  </div>
                )}

                {req.status === 'in_progress' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="material-symbols-outlined" style={{ color: '#00dbe7', animation: 'spin 2s linear infinite' }}>sensors</span>
                      <div style={{ fontSize: 13, color: '#00dbe7', fontWeight: 600 }}>Trip is in progress</div>
                    </div>
                    <button onClick={() => navigate(`/dashboard/hire/track/${req.id}`)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', border: 'none', borderRadius: 12, color: '#002022', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,219,231,0.3)' }}>
                      Track Trip
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
