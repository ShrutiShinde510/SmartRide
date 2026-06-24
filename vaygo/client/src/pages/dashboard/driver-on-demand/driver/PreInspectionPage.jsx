import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../../../utils/api';

export default function PreInspectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [request, setRequest] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    apiGet(`/api/m3/request/${id}`).then(({ ok, data }) => {
      if (ok && data.success) {
        setRequest(data.request);
        setBooking(data.booking);
      }
    });
  }, [id]);

  const handleCapture = () => {
    if (photos.length < 4) {
      setPhotos([...photos, 'captured_photo_url_mock']);
    }
  };

  const handleSubmit = async () => {
    if (!booking) return alert('Booking data not loaded yet');
    try {
      const { ok, data } = await apiPost('/api/m3/inspection/before', { bookingId: booking._id, photos });
      if (ok && data.success) {
        navigate(`/driver-dashboard/m3/active/${id}`);
      } else {
        alert(data.message || 'Failed to submit inspection');
      }
    } catch (err) {
      alert('Error submitting inspection');
    }
  };

  const labels = ['Front', 'Back', 'Left Side', 'Right Side'];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 8 }}>Pre-Trip Inspection</h2>
      {request && (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#00dbe7' }}>{request.familyId?.personal_info?.full_name}'s Car</div>
          <div style={{ fontSize: 14, color: 'rgba(211,228,254,0.7)', marginTop: 4 }}>Car: {request.carDetails?.brand} {request.carDetails?.model} ({request.carDetails?.transmission})</div>
        </div>
      )}
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ color: 'rgba(211,228,254,0.7)', fontSize: 14, marginBottom: 20 }}>
          Capture 4 photos of the family's car. AI will analyze them for existing damages.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {labels.map((lbl, idx) => (
            <div key={idx} style={{ height: 100, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: photos.length > idx ? '#00dbe7' : 'rgba(211,228,254,0.4)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, marginBottom: 4 }}>{photos.length > idx ? 'check_circle' : 'photo_camera'}</span>
              <span style={{ fontSize: 12 }}>{lbl}</span>
            </div>
          ))}
        </div>

        <button onClick={handleCapture} disabled={photos.length === 4} style={{ width: '100%', marginTop: 24, padding: 12, background: 'rgba(255,255,255,0.1)', color: '#d3e4fe', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontWeight: 700, cursor: photos.length === 4 ? 'not-allowed' : 'pointer' }}>
          Mock Capture Photo ({photos.length}/4)
        </button>

        {photos.length === 4 && (
          <button onClick={handleSubmit} style={{ width: '100%', marginTop: 12, padding: 16, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
            Submit to AI & Start Trip
          </button>
        )}
      </div>
    </div>
  );
}
