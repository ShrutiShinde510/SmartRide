import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostHireRequestPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    address: '',
    passengers: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/dashboard/hire/browse?from=${encodeURIComponent(form.from)}&to=${encodeURIComponent(form.to)}&date=${encodeURIComponent(form.date)}&time=${encodeURIComponent(form.time)}&address=${encodeURIComponent(form.address)}&passengers=${form.passengers}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px' }}>Hire a Vehicle</div>
          <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 2 }}>Enter your travel locations to find available cars</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Location Search */}
        <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: 24 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* From */}
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#00dbe7' }}>trip_origin</span>
              <input type="text" placeholder="Pickup Location (e.g., Pune)" required value={form.from} onChange={e => setForm({...form, from: e.target.value})}
                style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none' }} />
            </div>

            {/* To */}
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#ff4d4d' }}>location_on</span>
              <input type="text" placeholder="Drop Location (e.g., Mumbai)" required value={form.to} onChange={e => setForm({...form, to: e.target.value})}
                style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none' }} />
            </div>
            
            {/* Date, Time, Passengers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.6)', marginBottom: 8, fontWeight: 600 }}>Date</label>
                <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                  style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', colorScheme: 'dark' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.6)', marginBottom: 8, fontWeight: 600 }}>Pickup Time</label>
                <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                  style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', colorScheme: 'dark' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.6)', marginBottom: 8, fontWeight: 600 }}>People</label>
                <input type="number" min="1" max="10" required value={form.passengers} onChange={e => setForm({...form, passengers: e.target.value})}
                  style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            {/* Exact Pickup Address */}
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.5)' }}>home_pin</span>
              <input type="text" placeholder="Exact Pickup Address (Building, Street)" required value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none' }} />
            </div>
          </div>
        </div>

        <button type="submit" style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,219,231,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>search</span> Search Available Cars
        </button>
      </form>
    </div>
  );
}
