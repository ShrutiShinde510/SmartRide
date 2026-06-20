import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchRidePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    seats: 1
  });
  const [listening, setListening] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(form).toString();
    navigate(`/dashboard/search/results?${query}`);
  };

  const toggleVoice = () => {
    if (listening) {
      setListening(false);
      return;
    }
    setListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setForm(prev => ({ ...prev, from: 'Pune', to: 'Mumbai' }));
      setListening(false);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer', flexShrink: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px' }}>Find a Planned Trip</h2>
          <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginTop: 4 }}>Carpool with verified drivers heading your way</p>
        </div>
      </div>

      {/* Voice Search Prompt */}
      <div style={{ padding: '16px 20px', borderRadius: 16, background: listening ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)', border: listening ? '1px solid rgba(0,219,231,0.25)' : '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, transition: 'all 0.3s' }}>
        <button onClick={toggleVoice}
          style={{ width: 48, height: 48, borderRadius: '50%', background: listening ? '#00dbe7' : 'rgba(255,255,255,0.05)', color: listening ? '#002022' : '#00dbe7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: listening ? '0 0 20px rgba(0,219,231,0.4)' : 'none', transition: 'all 0.3s', animation: listening ? 'pulseSOS 1.5s infinite' : 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>mic</span>
        </button>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: listening ? '#00dbe7' : '#d3e4fe' }}>
            {listening ? 'Listening...' : 'Tap to speak'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', marginTop: 2 }}>
            "I need a ride from Pune to Mumbai tomorrow"
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#00dbe7' }}>trip_origin</span>
            <input type="text" placeholder="Leaving from..." required
              value={form.from} onChange={e => setForm({...form, from: e.target.value})}
              style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#d3e4fe', fontSize: 15, outline: 'none' }} />
          </div>
          
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#ff4d4d' }}>location_on</span>
            <input type="text" placeholder="Going to..." required
              value={form.to} onChange={e => setForm({...form, to: e.target.value})}
              style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#d3e4fe', fontSize: 15, outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.4)' }}>calendar_today</span>
            <input type="date" required
              value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#d3e4fe', fontSize: 15, outline: 'none', colorScheme: 'dark' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.4)' }}>group</span>
            <select required value={form.seats} onChange={e => setForm({...form, seats: e.target.value})}
              style={{ width: '100%', padding: '16px 16px 16px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#d3e4fe', fontSize: 15, outline: 'none', appearance: 'none' }}>
              {[1,2,3,4].map(num => (
                <option key={num} value={num} style={{ background: '#020e1c' }}>{num} {num === 1 ? 'Seat' : 'Seats'}</option>
              ))}
            </select>
            <span className="material-symbols-outlined" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.4)', pointerEvents: 'none' }}>expand_more</span>
          </div>
        </div>

        <button type="submit"
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, boxShadow: '0 8px 24px rgba(0,219,231,0.2)' }}>
          Search Rides
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
        </button>
      </form>
    </div>
  );
}
