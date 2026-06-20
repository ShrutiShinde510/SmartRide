import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../../../utils/api';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#00dbe7; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

// Component to dynamically adjust map bounds
function MapUpdater({ startLoc, endLoc }) {
  const map = useMap();
  useEffect(() => {
    if (startLoc && endLoc) {
      map.fitBounds([startLoc, endLoc], { padding: [30, 30] });
    } else if (startLoc) {
      map.setView(startLoc, 10);
    } else if (endLoc) {
      map.setView(endLoc, 10);
    }
  }, [map, startLoc, endLoc]);
  return null;
}

export default function CreateRidePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 4,
    price: 350
  });

  const [loading, setLoading] = useState(false);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);

  // Function to preview geocode on blur
  const geocodePreview = async (type, val) => {
    if (!val) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        if (type === 'start') setStartCoords(coords);
        if (type === 'end') setEndCoords(coords);
      }
    } catch(e) { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let startLoc = { lat: 18.5204, lng: 73.8567 }; // fallback
    let endLoc = { lat: 19.0760, lng: 72.8777 }; // fallback

    try {
      const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.from)}`);
      const startData = await startRes.json();
      if (startData && startData.length > 0) {
        startLoc = { lat: parseFloat(startData[0].lat), lng: parseFloat(startData[0].lon) };
      }

      const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.to)}`);
      const endData = await endRes.json();
      if (endData && endData.length > 0) {
        endLoc = { lat: parseFloat(endData[0].lat), lng: parseFloat(endData[0].lon) };
      }
    } catch (err) {
      console.warn('Geocoding failed, using fallback coordinates');
    }

    const payload = {
      ...form,
      startLocation: startLoc,
      endLocation: endLoc
    };
    
    const { ok, data } = await apiPost('/api/rides', payload);
    setLoading(false);

    if (ok && data.success) {
      alert('Ride posted successfully!');
      navigate('/driver-dashboard/rides');
    } else {
      alert(data.message || 'Failed to post ride');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px' }}>Post a Ride</h2>
          <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginTop: 4 }}>Share your planned trip and split costs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Route Details */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(211,228,254,0.6)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>Route Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#00dbe7' }}>trip_origin</span>
              <input type="text" placeholder="Pickup Location (e.g., Pune)" required
                value={form.from} onChange={e => setForm({...form, from: e.target.value})} onBlur={() => geocodePreview('start', form.from)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
            </div>
            
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#ff4d4d' }}>location_on</span>
              <input type="text" placeholder="Drop Location (e.g., Mumbai)" required
                value={form.to} onChange={e => setForm({...form, to: e.target.value})} onBlur={() => geocodePreview('end', form.to)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
            </div>
          </div>
          
          {/* Live Map Preview */}
          {(startCoords || endCoords) && (
            <div style={{ height: 160, width: '100%', marginTop: 20, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <MapContainer center={startCoords || endCoords} zoom={10} style={{ height: '100%', width: '100%', background: '#031427' }} zoomControl={false} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="CartoDB" />
                {startCoords && <Marker position={startCoords} icon={customIcon} />}
                {endCoords && <Marker position={endCoords} icon={customIcon} />}
                {startCoords && endCoords && <Polyline positions={[startCoords, endCoords]} color="#00dbe7" weight={3} dashArray="6 6" />}
                <MapUpdater startLoc={startCoords} endLoc={endCoords} />
              </MapContainer>
            </div>
          )}
        </div>

        {/* Schedule & Capacity */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(211,228,254,0.6)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>Schedule & Seats</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.4)' }}>calendar_today</span>
              <input type="date" required
                value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#d3e4fe', fontSize: 14, outline: 'none', colorScheme: 'dark' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.4)' }}>schedule</span>
              <input type="time" required
                value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#d3e4fe', fontSize: 14, outline: 'none', colorScheme: 'dark' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.4)' }}>event_seat</span>
              <input type="number" min="1" max="6" required placeholder="Seats available"
                value={form.seats} onChange={e => setForm({...form, seats: e.target.value})}
                style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#00dbe7', fontWeight: 700 }}>₹</span>
              <input type="number" min="50" step="50" required placeholder="Price per seat"
                value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#00dbe7', fontSize: 15, fontWeight: 700, outline: 'none' }} />
            </div>
          </div>
        </div>

        {/* Warning/Info Banner */}
        <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(0,219,231,0.05)', border: '1px solid rgba(0,219,231,0.2)', color: '#d3e4fe', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span className="material-symbols-outlined" style={{ color: '#00dbe7', fontSize: 20 }}>info</span>
          <div>
            <strong style={{ color: '#00dbe7', display: 'block', marginBottom: 4 }}>Vaygo Safety Policy</strong>
            You are restricted to posting a maximum of 2 planned trips per day to prevent commercial exploitation of carpooling.
          </div>
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '16px', background: loading ? 'rgba(0,219,231,0.5)' : 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, boxShadow: loading ? 'none' : '0 8px 24px rgba(0,219,231,0.2)' }}>
          {loading ? 'Publishing...' : 'Publish Ride'}
          {!loading && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>publish</span>}
        </button>

      </form>
    </div>
  );
}
