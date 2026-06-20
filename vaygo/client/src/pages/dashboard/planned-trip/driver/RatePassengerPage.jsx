import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PASSENGERS = [
  { id: '1', name: 'Rohan Gupta' },
  { id: '2', name: 'Sneha Kulkarni' },
];

export default function RatePassengerPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({ 1: 0, 2: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Passenger ratings submitted successfully.');
    navigate('/driver-dashboard/rides');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px' }}>
      
      <div style={{ marginBottom: 40, marginTop: 20, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.15),rgba(0,241,254,0.05))', border: '1px solid rgba(0,219,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#00dbe7' }}>task_alt</span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#d3e4fe', marginBottom: 8 }}>Trip Completed!</h2>
        <p style={{ fontSize: 14, color: 'rgba(211,228,254,0.5)' }}>How were your passengers on Trip {rideId}?</p>
      </div>

      <form onSubmit={handleSubmit}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {PASSENGERS.map((p) => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#d3e4fe' }}>person</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>{p.name}</div>
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star}
                    onClick={() => setRatings(prev => ({ ...prev, [p.id]: star }))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}>
                    <span className="material-symbols-outlined" 
                      style={{ fontSize: 28, color: star <= ratings[p.id] ? '#fbbf24' : 'rgba(255,255,255,0.1)', transition: 'color 0.2s', fontVariationSettings: star <= ratings[p.id] ? '"FILL" 1' : '"FILL" 0' }}>
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={Object.values(ratings).some(r => r === 0)}
          style={{ width: '100%', padding: '16px', background: Object.values(ratings).every(r => r > 0) ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'rgba(255,255,255,0.05)', color: Object.values(ratings).every(r => r > 0) ? '#002022' : 'rgba(211,228,254,0.3)', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: Object.values(ratings).every(r => r > 0) ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>
          Submit Ratings
        </button>
        
        <button type="button" onClick={() => navigate('/driver-dashboard/rides')}
          style={{ width: '100%', padding: '16px', background: 'transparent', color: 'rgba(211,228,254,0.5)', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>
          Skip
        </button>

      </form>

    </div>
  );
}
