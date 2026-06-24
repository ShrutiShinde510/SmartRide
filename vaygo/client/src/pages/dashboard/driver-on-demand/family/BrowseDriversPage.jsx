import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

export default function BrowseDriversPage() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    apiGet('/api/m3/drivers/available').then(({ ok, data }) => {
      if (ok) setDrivers(data.drivers);
    });
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Available Drivers Nearby</h2>
      
      <div style={{ display: 'grid', gap: 16 }}>
        {drivers.length === 0 ? (
          <p style={{ color: 'rgba(211,228,254,0.5)' }}>No trusted drivers available right now.</p>
        ) : (
          drivers.map(driver => (
            <div key={driver._id} style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#00dbe7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#031427' }}>person</span>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#d3e4fe' }}>{driver.personal_info.full_name}</div>
                  <div style={{ fontSize: 13, color: '#fbbf24', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>
                    {driver.platform_trust.hire_rating || 4.8} ({driver.platform_trust.total_rides_on_vaygo} Trips)
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginTop: 4 }}>
                    Experience: {driver.experience.years_driving} years
                  </div>
                </div>
              </div>
              <button onClick={() => navigate(`/dashboard/m3/driver/${driver._id}`)} style={{ padding: '10px 20px', background: 'rgba(0,219,231,0.1)', color: '#00dbe7', border: '1px solid rgba(0,219,231,0.3)', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                View Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
