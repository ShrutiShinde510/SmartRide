import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../../../utils/api';

export default function PostRequestPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    make: '', model: '', year: '', transmission: 'manual',
    pickup: '', dropoff: '', date: '', duration: 4,
    estimatedPrice: 600
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { ok, data } = await apiPost('/api/m3/request/create', {
        carDetails: { make: form.make, model: form.model, year: form.year, transmission: form.transmission },
        pickupLocation: form.pickup,
        dropoffLocation: form.dropoff,
        date: form.date,
        durationHours: form.duration,
        estimatedPrice: form.estimatedPrice
      });
      if (ok) {
        alert('Request posted successfully!');
        navigate('/dashboard/bookings');
      } else {
        alert('Failed to post request');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Request a Driver for Your Car</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 16, color: '#00dbe7', marginBottom: 12 }}>Car Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input type="text" placeholder="Make (e.g. Hyundai)" required value={form.make} onChange={e => setForm({...form, make: e.target.value})} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            <input type="text" placeholder="Model (e.g. i20)" required value={form.model} onChange={e => setForm({...form, model: e.target.value})} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            <input type="number" placeholder="Year" required value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            <select value={form.transmission} onChange={e => setForm({...form, transmission: e.target.value})} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              <option value="manual" style={{ color: '#000' }}>Manual</option>
              <option value="automatic" style={{ color: '#000' }}>Automatic</option>
            </select>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 16, color: '#00dbe7', marginBottom: 12 }}>Trip Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <input type="text" placeholder="Pickup Location" required value={form.pickup} onChange={e => setForm({...form, pickup: e.target.value})} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            <input type="text" placeholder="Dropoff Location" required value={form.dropoff} onChange={e => setForm({...form, dropoff: e.target.value})} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            <input type="datetime-local" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input type="number" placeholder="Duration (Hrs)" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} style={{ flex: 1, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              <div style={{ flex: 1, padding: 12, borderRadius: 8, background: 'rgba(0,219,231,0.1)', border: '1px solid rgba(0,219,231,0.3)', color: '#00dbe7', fontWeight: 700 }}>
                Est Price: ₹{form.duration * 150}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" style={{ padding: 16, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
          Find Drivers
        </button>

      </form>
    </div>
  );
}
