import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../../../utils/api';

export default function RateDriverPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [driverName, setDriverName] = useState('Loading...');

  useEffect(() => {
    async function fetchBooking() {
      const { ok, data } = await apiGet(`/api/bookings/${bookingId}`);
      if (ok && data.success) {
        setDriverName(data.booking.rideId?.driverId?.personal_info?.full_name || 'Driver');
      }
    }
    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { ok } = await apiPost(`/api/bookings/${bookingId}/rate`, { rating, feedback });
      if (ok) {
        alert(`Thank you for rating! You gave ${rating} stars.`);
        localStorage.setItem(`vaygo_rated_${bookingId}`, 'true');
        navigate('/dashboard/home');
      } else {
        alert('Failed to submit rating.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting rating');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px', textAlign: 'center' }}>
      
      <div style={{ marginBottom: 40, marginTop: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.15),rgba(0,241,254,0.05))', border: '1px solid rgba(0,219,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#00dbe7' }}>check_circle</span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#d3e4fe', marginBottom: 8 }}>Trip Completed</h2>
        <p style={{ fontSize: 14, color: 'rgba(211,228,254,0.5)' }}>How was your ride with {driverName}?</p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* Star Rating */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button type="button" key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(rating)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}>
              <span className="material-symbols-outlined" 
                style={{ fontSize: 48, color: star <= (hover || rating) ? '#fbbf24' : 'rgba(255,255,255,0.1)', transition: 'color 0.2s', fontVariationSettings: star <= (hover || rating) ? '"FILL" 1' : '"FILL" 0' }}>
                star
              </span>
            </button>
          ))}
        </div>

        {/* Feedback Textarea */}
        <textarea placeholder="Leave a compliment or suggest an improvement (optional)"
          value={feedback} onChange={e => setFeedback(e.target.value)}
          style={{ width: '100%', height: 120, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, color: '#d3e4fe', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: 32 }}></textarea>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 40 }}>
          {['Clean Car', 'Safe Driving', 'On Time', 'Polite', 'Good Music'].map(tag => (
            <button type="button" key={tag} style={{ padding: '8px 16px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(211,228,254,0.7)', fontSize: 13, cursor: 'pointer' }}>
              {tag}
            </button>
          ))}
        </div>

        <button type="submit" disabled={rating === 0}
          style={{ width: '100%', padding: '16px', background: rating > 0 ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'rgba(255,255,255,0.05)', color: rating > 0 ? '#002022' : 'rgba(211,228,254,0.3)', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: rating > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>
          Submit Feedback
        </button>
        
        <button type="button" onClick={() => navigate('/dashboard/home')}
          style={{ width: '100%', padding: '16px', background: 'transparent', color: 'rgba(211,228,254,0.5)', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>
          Skip for now
        </button>

      </form>

    </div>
  );
}
