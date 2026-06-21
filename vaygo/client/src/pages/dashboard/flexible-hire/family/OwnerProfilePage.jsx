import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiGet, apiPost } from '../../../../utils/api';

export default function OwnerProfilePage() {
  const navigate = useNavigate();
  const { ownerId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  const handleRequest = async () => {
    try {
      const payload = {
        ownerId,
        from: searchParams.get('from') || 'Pickup',
        to: searchParams.get('to') || 'Drop',
        date: searchParams.get('date') || new Date().toISOString().split('T')[0],
        time: searchParams.get('time') || '10:00',
        address: searchParams.get('address') || 'Not specified',
        passengers: parseInt(searchParams.get('passengers')) || 1,
      };

      const { ok, data } = await apiPost('/api/hires', payload);
      
      if (ok && data.success) {
        setRequestSent(true);
        setTimeout(() => {
          navigate('/dashboard/hire/offers');
        }, 2000);
      } else {
        alert(data?.message || 'Failed to send request');
      }
    } catch (err) {
      console.error('Error creating request:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    async function fetchOwner() {
      try {
        const { ok, data } = await apiGet(`/api/auth/flexible-drivers/${ownerId}`);
        if (ok && data.success) {
          const d = data.driver;
          setOwner({
            id: d._id,
            name: d.personal_info?.full_name || 'Driver',
            phone: d.personal_info?.phone || '+91 90000 00000',
            age: 34, // Mock
            joined: new Date(d.createdAt || Date.now()).getFullYear(),
            rating: (d.account?.safety_score / 20).toFixed(1) || 4.8,
            trips: d.platform_trust?.total_rides_on_vaygo || Math.floor(Math.random() * 200),
            car: { 
              model: `${d.vehicle?.brand || ''} ${d.vehicle?.model || ''}`.trim() || 'Vehicle', 
              year: d.vehicle?.year || new Date().getFullYear(), 
              type: d.vehicle?.type ? d.vehicle.type.charAt(0).toUpperCase() + d.vehicle.type.slice(1) : 'Sedan', 
              seats: d.vehicle?.total_seats || d.vehicle?.capacity || 4, 
              ac: d.vehicle?.ac !== false, 
              fuel: d.vehicle?.fuel_type ? d.vehicle.fuel_type.charAt(0).toUpperCase() + d.vehicle.fuel_type.slice(1) : 'Petrol', 
              luggage: d.vehicle?.luggage_capacity || d.vehicle?.luggage_space || 'Medium', 
              img: d.vehicle?.photos?.front || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80' 
            },
            pricing: { 
              hr: d.pricing?.rate_per_hour || 0, 
              km: d.pricing?.rate_per_km || 0, 
              minHours: d.availability?.min_booking_hrs || 4 
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch owner profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOwner();
  }, [ownerId]);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 40, textAlign: 'center', color: 'rgba(211,228,254,0.5)' }}>
        <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite', fontSize: 32, marginBottom: 16 }}>autorenew</span>
        <div>Loading profile...</div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!owner) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 40, textAlign: 'center', color: 'rgba(211,228,254,0.5)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 16, color: '#ff4d4d' }}>error</span>
        <div style={{ fontSize: 16, color: '#d3e4fe' }}>Profile Not Found</div>
        <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: '#d3e4fe', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 100 }}>
      
      {/* Hero Image */}
      <div style={{ height: 240, background: `url(${owner.car.img}) center/cover no-repeat`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(10,15,30,0.5) 0%, rgba(10,15,30,0) 40%, rgba(10,15,30,1) 100%)' }} />
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      <div style={{ padding: '0 20px', marginTop: -40, position: 'relative', zIndex: 2 }}>
        
        {/* Header Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{owner.car.model}</div>
            <div style={{ fontSize: 14, color: '#00dbe7', fontWeight: 600, marginTop: 4 }}>{owner.car.year} · {owner.car.type}</div>
          </div>
        </div>

        {/* Owner Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #00dbe7, #006b8f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', fontWeight: 800 }}>
            {owner.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#d3e4fe', display: 'flex', alignItems: 'center', gap: 6 }}>
              {owner.name}
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#22d3a0' }}>verified</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginTop: 4 }}>Joined {owner.joined} · {owner.trips} Trips</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {owner.rating} <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.4)', marginTop: 2 }}>Rating</div>
          </div>
        </div>

        {/* Vehicle Specs Grid */}
        <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe', marginBottom: 12 }}>Vehicle Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Seats', val: `${owner.car.seats} Passengers`, icon: 'airline_seat_recline_normal' },
            { label: 'AC', val: owner.car.ac ? 'Yes' : 'No', icon: 'ac_unit' },
            { label: 'Luggage', val: owner.car.luggage, icon: 'luggage' },
            { label: 'Fuel', val: owner.car.fuel, icon: 'local_gas_station' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="material-symbols-outlined" style={{ color: 'rgba(0,219,231,0.7)', fontSize: 20 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', fontWeight: 600 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 13, color: '#d3e4fe', fontWeight: 600, marginTop: 2 }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Info */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,219,231,0.05), rgba(0,0,0,0))', border: '1px solid rgba(0,219,231,0.15)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 12, letterSpacing: '0.5px' }}>OWNER'S STANDARD RATE</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: 'rgba(211,228,254,0.7)' }}>Per Hour</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#d3e4fe' }}>₹{owner.pricing.hr}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: 'rgba(211,228,254,0.7)' }}>Per Kilometer</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#d3e4fe' }}>₹{owner.pricing.km}</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
            * Minimum booking duration is {owner.pricing.minHours} hours. Final price is negotiable through chat.
          </div>
        </div>

      </div>

      {/* Action Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'rgba(10, 15, 30, 0.95)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 12 }}>
          {requestSent ? (
            <div style={{ flex: 1, padding: '16px', background: 'rgba(34,211,160,0.1)', color: '#22d3a0', border: '1px solid rgba(34,211,160,0.2)', borderRadius: 14, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span className="material-symbols-outlined">check_circle</span> Request Sent Successfully!
            </div>
          ) : (
            <button onClick={handleRequest}
              style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,219,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Request to Hire <span className="material-symbols-outlined">send</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
