import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPut } from '../../../../utils/api';

export default function ManageRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, offer_sent, rejected
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerPrice, setOfferPrice] = useState('');

  useEffect(() => {
    async function fetchRequests() {
      try {
        const { ok, data } = await apiGet('/api/hires/driver-requests');
        if (ok && data.success) {
          const mapped = data.requests.map(req => ({
            id: req._id,
            passengerName: req.passenger?.full_name || 'Passenger',
            passengerPhone: req.passenger?.phone || '',
            from: req.from,
            to: req.to,
            address: req.address,
            date: req.date,
            time: req.time,
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

  const updateStatus = async (id, status, finalPrice = undefined) => {
    try {
      const payload = { status };
      if (finalPrice !== undefined) payload.finalPrice = finalPrice;
      const { ok } = await apiPut(`/api/hires/${id}/status`, payload);
      if (ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status, finalPrice: finalPrice !== undefined ? finalPrice : r.finalPrice } : r));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleAction = async (req, action) => {
    if (action === 'rejected') {
      await updateStatus(req.id, 'rejected');
    } else if (action === 'accept') {
      setSelectedRequest(req);
      setOfferPrice('');
      setOfferModalOpen(true);
    }
  };

  const handleStartTrip = async (reqId) => {
    await updateStatus(reqId, 'in_progress');
  };

  const handleEndTrip = async (reqId) => {
    await updateStatus(reqId, 'completed');
  };

  const submitOffer = async (e) => {
    e.preventDefault();
    if (!offerPrice) return;
    await updateStatus(selectedRequest.id, 'offer_sent', offerPrice);
    setOfferModalOpen(false);
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter(r => r.status === filter);

  return (
    <div style={{ background: '#020e1c', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", minHeight: '100vh', paddingBottom: 60, position: 'relative' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button onClick={() => navigate('/driver-dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer', transition: 'all 0.2s' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px', margin: 0 }}>Manage Requests</h2>
            <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 4, margin: 0 }}>Review requests, check passenger details, and send pricing offers</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, background: 'rgba(255,255,255,0.02)', padding: 6, borderRadius: 14 }}>
          {[
            { id: 'pending', label: 'Pending' }, 
            { id: 'offer_sent', label: 'Offers Sent' }, 
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'in_progress', label: 'Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'rejected', label: 'Rejected' }
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: filter === f.id ? 'rgba(0,219,231,0.15)' : 'transparent', border: filter === f.id ? '1px solid rgba(0,219,231,0.3)' : '1px solid transparent', color: filter === f.id ? '#00dbe7' : 'rgba(211,228,254,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'rgba(211,228,254,0.5)' }}>Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(0,219,231,0.2)', marginBottom: 12 }}>inbox</span>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe' }}>No {filter.replace('_', ' ')} requests</div>
              <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 6 }}>You'll see passenger booking requests here when they arrive.</div>
            </div>
          ) : (
            filteredRequests.map(req => (
              <div key={req.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Request Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.1),rgba(0,241,254,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,219,231,0.2)' }}>
                      <span className="material-symbols-outlined" style={{ color: '#00dbe7' }}>person</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#d3e4fe' }}>Passenger Request</div>
                      <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginTop: 2 }}>ID: {req.id}</div>
                    </div>
                  </div>
                  {req.status === 'offer_sent' && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#00dbe7' }}>₹{req.finalPrice}</div>
                      <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginTop: 2 }}>Offer Sent</div>
                    </div>
                  )}
                  {req.status === 'confirmed' && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#22d3a0', fontWeight: 800, letterSpacing: '0.5px', background: 'rgba(34,211,160,0.1)', padding: '4px 12px', borderRadius: 20 }}>BOOKED</div>
                      <div style={{ fontSize: 13, color: '#d3e4fe', marginTop: 4, fontWeight: 700 }}>₹{req.finalPrice}</div>
                    </div>
                  )}
                  {req.status === 'in_progress' && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800, letterSpacing: '0.5px', background: 'rgba(251,191,36,0.1)', padding: '4px 12px', borderRadius: 20 }}>IN PROGRESS</div>
                      <div style={{ fontSize: 13, color: '#d3e4fe', marginTop: 4, fontWeight: 700 }}>₹{req.finalPrice}</div>
                    </div>
                  )}
                  {req.status === 'completed' && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#22d3a0', fontWeight: 800, letterSpacing: '0.5px', background: 'rgba(34,211,160,0.1)', padding: '4px 12px', borderRadius: 20 }}>COMPLETED</div>
                      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 4, fontWeight: 700, textDecoration: 'line-through' }}>₹{req.finalPrice}</div>
                    </div>
                  )}
                </div>

                {(req.status === 'confirmed' || req.status === 'in_progress' || req.status === 'completed') && (
                  <div style={{ background: 'rgba(34,211,160,0.05)', border: '1px solid rgba(34,211,160,0.2)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#22d3a0', marginBottom: 12, letterSpacing: '0.5px' }}>PASSENGER CONTACT</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(211,228,254,0.6)' }}>person</span>
                      <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{req.passengerName || 'Riya S. (Passenger)'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#22d3a0' }}>call</span>
                      <span style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{req.passengerPhone || '+91 98765 12345'}</span>
                    </div>
                  </div>
                )}

                {/* Route & Time */}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#00dbe7', marginTop: 2 }}>trip_origin</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#d3e4fe' }}>{req.from}</div>
                      <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginTop: 4 }}>Pickup: {req.address || 'Not specified'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ff4d4d' }}>location_on</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#d3e4fe' }}>{req.to}</div>
                  </div>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 12, paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(211,228,254,0.6)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span>
                      {new Date(req.date).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(211,228,254,0.6)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>
                      {req.time || '10:00'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(211,228,254,0.6)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>group</span>
                      {req.passengers} People
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {req.status === 'pending' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                    <button onClick={() => handleAction(req, 'rejected')} style={{ padding: '14px', background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)', borderRadius: 12, color: '#ff4d4d', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                      Decline Request
                    </button>
                    <button onClick={() => handleAction(req, 'accept')} style={{ padding: '14px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', border: 'none', borderRadius: 12, color: '#002022', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,219,231,0.25)', transition: 'all 0.2s' }}>
                      Accept & Send Offer
                    </button>
                  </div>
                )}
                
                {req.status === 'offer_sent' && (
                  <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: 13, color: 'rgba(211,228,254,0.6)' }}>
                    Waiting for passenger to accept the offer and complete payment...
                  </div>
                )}

                {req.status === 'confirmed' && (
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <button onClick={() => handleStartTrip(req.id)} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', border: 'none', borderRadius: 12, color: '#002022', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,219,231,0.25)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span className="material-symbols-outlined">directions_car</span> Start Trip
                    </button>
                  </div>
                )}
                {req.status === 'in_progress' && (
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <button onClick={() => navigate(`/driver-dashboard/owner/active/${req.id}`)} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#d3e4fe', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                      <span className="material-symbols-outlined" style={{ animation: 'pulse 2s infinite', color: '#00dbe7' }}>sensors</span> View GPS
                    </button>
                    <button onClick={() => handleEndTrip(req.id)} style={{ padding: '14px 20px', background: '#ff4d4d', border: 'none', borderRadius: 12, color: '#1a0505', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>
                      End Trip
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {offerModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 400, background: '#0a101d', border: '1px solid rgba(0,219,231,0.2)', borderRadius: 20, padding: 28, boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Set Your Price Offer</div>
            <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginBottom: 24 }}>Enter the final price you want to charge the passenger for this trip.</div>
            
            <form onSubmit={submitOffer}>
              <div style={{ position: 'relative', marginBottom: 24 }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.5)' }}>₹</span>
                <input type="number" required placeholder="e.g. 2500" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)}
                  style={{ width: '100%', padding: '16px 16px 16px 40px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 18, fontWeight: 700, outline: 'none' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button type="button" onClick={() => setOfferModalOpen(false)} style={{ padding: '14px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 12, color: '#d3e4fe', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', border: 'none', borderRadius: 12, color: '#002022', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Send Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
    </div>
  );
}
