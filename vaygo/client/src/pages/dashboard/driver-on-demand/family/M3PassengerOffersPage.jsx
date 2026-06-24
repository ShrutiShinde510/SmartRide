import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiPost } from '../../../../utils/api';

export default function M3PassengerOffersPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOffers = async () => {
      try {
        const { ok, data } = await apiGet('/api/m3/request/my-requests');
        if (ok && data.success && isMounted) {
          const req = data.requests.find(r => r._id === id);
          setRequest(req);
        }
      } catch (err) {
        console.error('Failed to fetch request', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOffers();
    const intervalId = setInterval(fetchOffers, 3000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [id]);

  const handleAcceptDriver = async (driverId) => {
    try {
      const { ok, data } = await apiPost('/api/m3/booking/select-driver', { requestId: id, driverId });
      if (ok && data.success) {
        alert('Driver selected! Waiting for their confirmation.');
        // Refresh request data to update the UI state
        const { ok: refreshOk, data: refreshData } = await apiGet('/api/m3/request/my-requests');
        if (refreshOk && refreshData.success) {
          const req = refreshData.requests.find(r => r._id === id);
          setRequest(req);
        }
      } else {
        alert(data.message || 'Failed to select driver');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: '#00dbe7' }}>Loading offers...</div>;
  }

  if (!request) {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(211,228,254,0.5)' }}>Request not found.</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>

      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>Driver Offers</h2>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginBottom: 24 }}>
        Select the best driver for your {request.carDetails?.make} {request.carDetails?.model}
      </div>

      {request.status === 'accepted' ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#22d3a0' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12 }}>check_circle</span>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Driver Confirmed!</div>
          <div style={{ fontSize: 13, marginTop: 8, color: 'rgba(211,228,254,0.6)' }}>
            Your driver has confirmed the assignment. Your booking is now active.
          </div>
          <button onClick={() => navigate('/dashboard/bookings')} style={{ marginTop: 24, padding: '10px 24px', background: 'rgba(34,211,160,0.1)', color: '#22d3a0', border: '1px solid rgba(34,211,160,0.3)', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            Go to My Bookings
          </button>
        </div>
      ) : request.status === 'driver_confirmation_pending' ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#fbbf24' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12 }}>hourglass_top</span>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Waiting for Driver Confirmation</div>
          <div style={{ fontSize: 13, marginTop: 8, color: 'rgba(211,228,254,0.6)' }}>
            You have selected a driver. Once they confirm, the booking will be finalized.
          </div>
        </div>
      ) : request.interestedDrivers?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(211,228,254,0.3)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12 }}>hourglass_empty</span>
          <div>Waiting for drivers to apply...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {request.interestedDrivers?.map(driver => (
            <div key={driver._id} style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 25, background: 'rgba(0,219,231,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00dbe7', fontSize: 24 }}>
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe' }}>{driver.personal_info?.full_name}</div>
                    <div style={{ fontSize: 13, color: '#fbbf24', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>
                      {driver.platform_trust?.hire_rating || '5.0'} Rating
                    </div>
                  </div>
                </div>
                
                <button onClick={() => handleAcceptDriver(driver._id)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                  Choose Driver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
