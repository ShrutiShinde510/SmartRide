import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../../../utils/api';

export default function HireDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('vaygo_user') || '{}');
  const userId = user._id || user.id;

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { ok, data } = await apiGet('/api/m3/request/pending');
      if (ok && data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Failed to fetch pending requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApply = async (requestId) => {
    try {
      const { ok, data } = await apiPost('/api/m3/request/apply', { requestId });
      if (ok && data.success) {
        alert('Applied for gig successfully!');
        fetchRequests(); // Refresh the list to show "Applied"
      } else {
        alert(data.message || 'Failed to apply for gig');
        fetchRequests();
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleConfirm = async (requestId) => {
    try {
      const { ok, data } = await apiPost('/api/m3/booking/confirm', { requestId, driverId: userId });
      if (ok && data.success) {
        alert('Assignment confirmed! Starting booking process...');
        navigate(`/driver-dashboard/m3/navigate/${requestId}`);
      } else {
        alert(data.message || 'Failed to confirm assignment');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
      
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Driver on Demand - Gig Board</h2>
      
      {loading ? (
        <div style={{ color: '#00dbe7', textAlign: 'center', marginTop: 40 }}>Loading requests...</div>
      ) : requests.length === 0 ? (
        <div style={{ color: 'rgba(211,228,254,0.6)', textAlign: 'center', marginTop: 40 }}>No gigs available right now.</div>
      ) : (
        <>
          {requests.filter(req => req.status === 'driver_confirmation_pending').length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24', marginBottom: 16 }}>Pending Confirmations</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {requests.filter(req => req.status === 'driver_confirmation_pending').map(req => (
                  <div key={req._id} style={{ background: 'rgba(251,191,36,0.05)', padding: 20, borderRadius: 16, border: '1px solid rgba(251,191,36,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe' }}>{req.familyId?.personal_info?.full_name || 'Family'}</div>
                        <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.6)', marginTop: 4 }}>Car: <span style={{ color: '#00dbe7' }}>{req.carDetails?.make} {req.carDetails?.model} ({req.carDetails?.transmission})</span></div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#00dbe7' }}>₹{req.estimatedPrice}</div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: 13, color: 'rgba(211,228,254,0.7)' }}>
                      <div>From: {req.pickupLocation}</div>
                      <div>To: {req.dropoffLocation}</div>
                      <div>Duration: {req.durationHours} hrs</div>
                    </div>

                    <div style={{ padding: 12, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ color: '#fbbf24', fontSize: 13, marginBottom: 8, fontWeight: 700 }}>You have been selected!</div>
                      <button onClick={() => handleConfirm(req._id)} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#000', border: 'none', borderRadius: 6, fontWeight: 800, cursor: 'pointer' }}>
                        Confirm Assignment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {requests.filter(req => req.status !== 'driver_confirmation_pending').length > 0 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe', marginBottom: 16 }}>Available Gigs</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {requests.filter(req => req.status !== 'driver_confirmation_pending').map(req => (
                  <div key={req._id} style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe' }}>{req.familyId?.personal_info?.full_name || 'Family'}</div>
                        <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.6)', marginTop: 4 }}>Car: <span style={{ color: '#00dbe7' }}>{req.carDetails?.make} {req.carDetails?.model} ({req.carDetails?.transmission})</span></div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#00dbe7' }}>₹{req.estimatedPrice}</div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: 13, color: 'rgba(211,228,254,0.7)' }}>
                      <div>From: {req.pickupLocation}</div>
                      <div>To: {req.dropoffLocation}</div>
                      <div>Duration: {req.durationHours} hrs</div>
                    </div>

                    {req.interestedDrivers?.includes(userId) ? (
                      <button disabled style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,0.05)', color: 'rgba(211,228,254,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontWeight: 700, cursor: 'not-allowed' }}>
                        Applied
                      </button>
                    ) : (
                      <button onClick={() => handleApply(req._id)} style={{ width: '100%', padding: 12, background: 'rgba(0,219,231,0.1)', color: '#00dbe7', border: '1px solid rgba(0,219,231,0.3)', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                        Apply for Gig
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
