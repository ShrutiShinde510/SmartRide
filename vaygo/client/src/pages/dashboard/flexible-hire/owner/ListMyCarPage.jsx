import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListMyCarPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    type: 'four_wheeler_4',
    registrationNo: '',
    seats: 4,
    ac: true,
    fuelType: 'petrol',
    luggage: 'medium',
    hourlyRate: 150,
    kmRate: 12,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('vaygo_user');
    if (cached) {
      try {
        const user = JSON.parse(cached);
        setFormData({
          brand: user.vehicle?.brand || '',
          model: user.vehicle?.model || '',
          type: user.vehicle?.type?.toLowerCase() || 'four_wheeler_4',
          registrationNo: user.vehicle?.registration_no || '',
          seats: user.vehicle?.total_seats || user.vehicle?.capacity || 4,
          ac: user.vehicle?.ac !== false, // default true if undefined
          fuelType: user.vehicle?.fuel_type?.toLowerCase() || 'petrol',
          luggage: user.vehicle?.luggage_space?.toLowerCase() || user.vehicle?.luggage_capacity?.toLowerCase() || 'medium',
          hourlyRate: user.pricing?.rate_per_hour || user.driver_experience?.hourly_charges || 150,
          kmRate: user.pricing?.rate_per_km || user.pricing?.rate_per_trip || user.driver_experience?.km_charges || 12,
        });
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Vehicle successfully listed for Flexible Hire!');
      navigate('/driver-dashboard');
    }, 1500);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#d3e4fe',
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(211,228,254,0.6)',
    marginBottom: 8,
    display: 'block'
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24
  };

  const sectionTitleStyle = {
    fontSize: 16,
    fontWeight: 700,
    color: '#00dbe7',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  };

  return (
    <div style={{ background: '#020e1c', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button onClick={() => navigate('/driver-dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer', transition: 'all 0.2s' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px', margin: 0 }}>List My Car</h2>
            <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 4, margin: 0 }}>Setup your vehicle details to start accepting Flexible Hire requests</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Vehicle Information */}
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>
              <span className="material-symbols-outlined">directions_car</span> Vehicle Information
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Make / Brand</label>
                <input type="text" required placeholder="e.g. Honda" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Model</label>
                <input type="text" required placeholder="e.g. City" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Vehicle Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{...inputStyle, appearance: 'none'}}>
                  <option value="two_wheeler">Two Wheeler (Bike/Scooter)</option>
                  <option value="three_wheeler">Three Wheeler (Auto Rickshaw)</option>
                  <option value="four_wheeler_4">Four Wheeler (4 Seater)</option>
                  <option value="four_wheeler_7">Four Wheeler (6/7 Seater)</option>
                  <option value="four_wheeler_luxury">Four Wheeler (Luxury/Premium)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Registration Number</label>
                <input type="text" required placeholder="e.g. MH 12 AB 1234" value={formData.registrationNo} onChange={e => setFormData({...formData, registrationNo: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Features & Specifications */}
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>
              <span className="material-symbols-outlined">tune</span> Features & Specifications
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Total Seats (Including Driver)</label>
                <input type="number" min="2" max="15" required value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Fuel Type</label>
                <select value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})} style={{...inputStyle, appearance: 'none'}}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="ev">Electric (EV)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Luggage Capacity</label>
                <select value={formData.luggage} onChange={e => setFormData({...formData, luggage: e.target.value})} style={{...inputStyle, appearance: 'none'}}>
                  <option value="small">Small (1-2 bags)</option>
                  <option value="medium">Medium (3-4 bags)</option>
                  <option value="large">Large (5+ bags)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Air Conditioning (AC)</label>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <button type="button" onClick={() => setFormData({...formData, ac: true})} style={{ flex: 1, padding: '12px', borderRadius: 10, border: formData.ac ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.1)', background: formData.ac ? 'rgba(0,219,231,0.1)' : 'rgba(255,255,255,0.02)', color: formData.ac ? '#00dbe7' : '#d3e4fe', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Yes</button>
                  <button type="button" onClick={() => setFormData({...formData, ac: false})} style={{ flex: 1, padding: '12px', borderRadius: 10, border: !formData.ac ? '1px solid #ff4d4d' : '1px solid rgba(255,255,255,0.1)', background: !formData.ac ? 'rgba(255,77,77,0.1)' : 'rgba(255,255,255,0.02)', color: !formData.ac ? '#ff4d4d' : '#d3e4fe', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>No</button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Config */}
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>
              <span className="material-symbols-outlined">payments</span> Set Your Rates
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Hourly Base Rate (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: 14, color: 'rgba(211,228,254,0.5)', fontWeight: 600 }}>₹</span>
                  <input type="number" min="0" required value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} style={{...inputStyle, paddingLeft: 34}} />
                </div>
                <p style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginTop: 8 }}>Charged per hour of the booking duration.</p>
              </div>
              <div>
                <label style={labelStyle}>Rate Per KM (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: 14, color: 'rgba(211,228,254,0.5)', fontWeight: 600 }}>₹</span>
                  <input type="number" min="0" required value={formData.kmRate} onChange={e => setFormData({...formData, kmRate: e.target.value})} style={{...inputStyle, paddingLeft: 34}} />
                </div>
                <p style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginTop: 8 }}>Applied if the trip exceeds standard local limits.</p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button type="submit" disabled={isSaving} style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,219,231,0.25)', transition: 'all 0.2s', opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? (
              <>
                <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
                Publishing Listing...
              </>
            ) : (
              <>
                Publish Vehicle Listing <span className="material-symbols-outlined">rocket_launch</span>
              </>
            )}
          </button>
          
        </form>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        select option { background: #061524; color: #d3e4fe; }
        input:focus, select:focus { border-color: #00dbe7 !important; background: rgba(0,219,231,0.03) !important; }
      `}</style>
    </div>
  );
}
