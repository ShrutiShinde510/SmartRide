import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

export default function LiveTrackingPage() {
  const { id } = useParams(); // bookingId
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [lat, setLat] = useState(18.5204);
  const [lng, setLng] = useState(73.8567);

  useEffect(() => {
    // Initial fetch
    apiGet(`/api/m3/request/${id}`).then(({ ok, data }) => {
      if (ok && data.success) {
        setRequest(data.request);
        if (data.request.status === 'completed') {
          navigate(`/dashboard/m3/return/${id}`);
        }
      }
    });

    const interval = setInterval(() => {
      setLat(prev => prev + (Math.random() - 0.5) * 0.005);
      setLng(prev => prev + (Math.random() - 0.5) * 0.005);
      
      // Poll for status update
      apiGet(`/api/m3/request/${id}`).then(({ ok, data }) => {
        if (ok && data.success) {
          setRequest(data.request);
          if (data.request.status === 'completed') {
            navigate(`/dashboard/m3/return/${id}`);
          }
        }
      });
    }, 5000); // update every 5 seconds
    return () => clearInterval(interval);
  }, [id, navigate]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '80vh' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 8 }}>Live Tracking (Model 3)</h2>
      {request && request.driverId && (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#00dbe7' }}>Driver: {request.driverId?.personal_info?.full_name || 'Assigned Driver'}</div>
            <div style={{ fontSize: 14, color: 'rgba(211,228,254,0.7)', marginTop: 4 }}>Phone: {request.driverId?.personal_info?.phone || 'Hidden'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, color: '#22d3a0', fontWeight: 700 }}>En Route</div>
          </div>
        </div>
      )}
      
      <div style={{ flex: 1, background: 'radial-gradient(circle, rgba(0,219,231,0.05) 10%, transparent 80%), #051a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(0,219,231,0.25)', position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) translate(${(lng - 73.8567)*10000}px, ${(18.5204 - lat)*10000}px)`, transition: 'all 5s linear' }}>directions_car</span>
        <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(3,20,39,0.8)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)' }}>Driver is en route...</div>
          <div style={{ fontSize: 14, color: '#00dbe7', fontWeight: 700 }}>Lat: {lat.toFixed(4)} Lng: {lng.toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
}
