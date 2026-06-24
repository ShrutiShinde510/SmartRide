import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RateDriverPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    alert('Rating submitted!');
    navigate('/dashboard/home');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Rate Your Driver</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} onClick={() => setRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: star <= rating ? '#fbbf24' : 'rgba(255,255,255,0.1)' }}>star</span>
          </button>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={rating === 0} style={{ width: '100%', padding: 16, background: rating > 0 ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'rgba(255,255,255,0.05)', color: rating > 0 ? '#002022' : 'rgba(211,228,254,0.3)', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: rating > 0 ? 'pointer' : 'not-allowed' }}>
        Submit Rating
      </button>
    </div>
  );
}
