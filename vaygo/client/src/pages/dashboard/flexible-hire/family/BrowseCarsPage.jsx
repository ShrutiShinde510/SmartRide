import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';

export default function BrowseCarsPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const { ok, data } = await apiGet('/api/auth/flexible-drivers');
        if (ok && data.success) {
          // Map backend driver data to UI format
          const mappedCars = data.drivers.map(driver => ({
            id: driver._id,
            model: `${driver.vehicle?.brand || ''} ${driver.vehicle?.model || 'Car'}`.trim() || 'Vehicle',
            year: driver.vehicle?.year || new Date().getFullYear() - Math.floor(Math.random() * 5),
            owner: driver.personal_info?.full_name || 'Driver',
            rating: (driver.account?.safety_score / 20).toFixed(1) || 4.8, // Assuming safety_score is out of 100
            trips: driver.platform_trust?.total_rides_on_vaygo || Math.floor(Math.random() * 200),
            priceHr: driver.pricing?.rate_per_hour || 0,
            priceKm: driver.pricing?.rate_per_km || 0,
            img: driver.vehicle?.photos?.front || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=400&q=80',
            distance: `${(Math.random() * 5 + 1).toFixed(1)} km away` // Mock distance for now
          }));
          setCars(mappedCars);
        }
      } catch (err) {
        console.error("Failed to fetch drivers", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 20px 100px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px' }}>Available Cars</div>
          <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 2 }}>
            {loading ? 'Searching for vehicles...' : `Found ${cars.length} vehicles near you`}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(211,228,254,0.5)' }}>
          <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite', fontSize: 32, marginBottom: 16 }}>autorenew</span>
          <div>Finding the best cars nearby...</div>
        </div>
      ) : cars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(0,219,231,0.2)', marginBottom: 12 }}>directions_car</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe' }}>No cars available right now</div>
          <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 6 }}>Try checking back later or adjusting your location.</div>
        </div>
      ) : (
        /* Car List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cars.map(car => (
            <div key={car.id} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Image & Quick Stats */}
              <div style={{ height: 160, background: `url(${car.img}) center/cover no-repeat`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#22d3a0' }}>location_on</span>
                  {car.distance}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#d3e4fe' }}>{car.model} <span style={{ fontSize: 12, color: 'rgba(211,228,254,0.4)', fontWeight: 600 }}>({car.year})</span></div>
                    <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.6)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                      Driven by {car.owner}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(251,191,36,0.1)', padding: '4px 8px', borderRadius: 6, color: '#fbbf24', fontSize: 12, fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>star</span>
                      {car.rating}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginTop: 4 }}>{car.trips} trips</div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.5)', fontWeight: 600, marginBottom: 2 }}>ESTIMATED RATE</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#00dbe7' }}>₹{car.priceHr}/hr <span style={{ fontSize: 12, color: 'rgba(211,228,254,0.4)', fontWeight: 600 }}>+ ₹{car.priceKm}/km</span></div>
                  </div>
                  <button onClick={() => navigate(`/dashboard/hire/owner/${car.id}${window.location.search}`)}
                    style={{ padding: '10px 20px', background: 'rgba(0,219,231,0.1)', border: '1px solid rgba(0,219,231,0.2)', borderRadius: 10, color: '#00dbe7', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
