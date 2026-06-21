import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RateOwnerPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    alert('Thank you for your feedback!');
    navigate('/dashboard'); // Return to main dashboard
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px', textAlign: 'center' }}>
      
      <div style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 8 }}>Rate Your Trip</div>
      <div style={{ fontSize: 14, color: 'rgba(211,228,254,0.5)', marginBottom: 40 }}>How was your experience with Ramesh K.?</div>

      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #00dbe7, #006b8f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 auto 24px', border: '4px solid rgba(0,219,231,0.3)' }}>
        R
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} onClick={() => setRating(star)}
            className="material-symbols-outlined" 
            style={{ fontSize: 48, cursor: 'pointer', color: star <= rating ? '#fbbf24' : 'rgba(255,255,255,0.1)', transition: 'color 0.2s' }}>
            star
          </span>
        ))}
      </div>

      <div style={{ textAlign: 'left', marginBottom: 40 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#d3e4fe', marginBottom: 12 }}>Leave a review (Optional)</label>
        <textarea 
          placeholder="What did you like about the trip?" 
          value={review} onChange={e => setReview(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: '#fff', fontSize: 14, outline: 'none', resize: 'none' }} 
        />
      </div>

      <button onClick={handleSubmit} disabled={rating === 0}
        style={{ width: '100%', padding: '16px', background: rating > 0 ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'rgba(255,255,255,0.05)', color: rating > 0 ? '#002022' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: rating > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
        Submit Feedback
      </button>

    </div>
  );
}
