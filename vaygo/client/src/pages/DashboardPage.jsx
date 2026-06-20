import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPut } from '../utils/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSOS, setActiveSOS] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rideType, setRideType] = useState('planned'); // planned, hire, driver
  const [rideBooked, setRideBooked] = useState(false);
  const [realRides, setRealRides] = useState([]);

  // Experience and charges update state
  const [rates, setRates] = useState({ hourly: 150, km: 12 });

  useEffect(() => {
    const token = localStorage.getItem('vaygo_token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load cached user immediately for fast render
    const cached = localStorage.getItem('vaygo_user');
    if (cached) {
      const parsed = JSON.parse(cached);
      setUser(parsed);
      setRates({
        hourly: parsed.pricing?.rate_per_hour || parsed.driver_experience?.hourly_charges || 150,
        km: parsed.pricing?.rate_per_km || parsed.pricing?.rate_per_trip || parsed.driver_experience?.km_charges || 12,
      });
    }

    // Fetch fresh data from server
    apiGet('/api/auth/me').then(({ ok, data }) => {
      if (ok && data.user) {
        setUser(data.user);
        localStorage.setItem('vaygo_user', JSON.stringify(data.user));
        setRates({
          hourly: data.user.pricing?.rate_per_hour || data.user.driver_experience?.hourly_charges || 150,
          km: data.user.pricing?.rate_per_km || data.user.pricing?.rate_per_trip || data.user.driver_experience?.km_charges || 12,
        });
      } else if (!ok) {
        setFetchError('Could not load profile. Showing cached data.');
      }
    }).catch(() => {
      setFetchError('Network error. Showing cached data.');
    });

    // Fetch real driver rides if token exists
    apiGet('/api/rides/driver').then(({ ok, data }) => {
      if (ok && data.success) {
        setRealRides(data.rides.slice(0, 5)); // show top 5
      }
    });

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('vaygo_token');
    localStorage.removeItem('vaygo_user');
    navigate('/');
  };

  const triggerSOS = () => {
    setActiveSOS(true);
    setTimeout(() => {
      alert(`🚨 SOS ALERT! Real-time coordinates and audio feed sent to Police & Emergency Contacts!`);
      setActiveSOS(false);
    }, 1200);
  };

  const handleSearchRide = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setRideBooked(true);
    setTimeout(() => {
      setRideBooked(false);
      alert(`Trip request to "${searchQuery}" created successfully! Match found.`);
    }, 2000);
  };

  const handleSaveRates = async () => {
    try {
      const body = {
        rate_per_hour: Number(rates.hourly)
      };
      if (userRole === 'DRIVER_HIRE') {
        body.rate_per_km = Number(rates.km);
      } else {
        body.rate_per_trip = Number(rates.km);
      }

      const { ok, data } = await apiPut('/api/auth/update-rates', body);
      if (!ok) throw new Error(data.message || 'Failed to update rates');

      setUser(data.user);
      localStorage.setItem('vaygo_user', JSON.stringify(data.user));
      alert('Rates successfully updated in database!');
    } catch (err) {
      alert(`Error updating rates: ${err.message}`);
    }
  };

  if (!user) {
    return (
      <div style={{ background: '#031427', color: '#d3e4fe', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading dashboard details...
      </div>
    );
  }

  const userRole = (user.account?.role || user.role || '').toUpperCase();
  const userStatus = (user.account?.account_status || user.status || '').toUpperCase();
  const userFullName = user.personal_info?.full_name || user.name || '';
  const emergencyName = user.trusted_contacts?.[0]?.name || user.emergency_contact?.name || 'Emergency Person';
  const emergencyPhone = user.trusted_contacts?.[0]?.phone || user.emergency_contact?.phone || 'Emergency Phone';
  
  // Vehicle Display Formatters
  const vehicleBrand = user.vehicle?.brand || '';
  const vehicleModel = user.vehicle?.model || '';
  const rawVehicleType = user.vehicle?.type || '';
  const vehicleType = rawVehicleType ? (rawVehicleType.charAt(0).toUpperCase() + rawVehicleType.slice(1)) : 'Sedan';
  const vehicleNumber = user.vehicle?.registration_no || 'MH 12 AB 1234';
  const vehicleSeats = user.vehicle?.total_seats || 4;
  const vehicleAC = user.vehicle?.ac;
  const vehicleLuggage = user.vehicle?.luggage_space || user.vehicle?.luggage_capacity || 'medium';
  const vehicleFuel = user.vehicle?.fuel_type || 'petrol';

  // Availability / Experience Formatters
  const yearsDriving = user.experience?.years_driving || 0;
  const preferredCities = user.availability?.service_areas?.join(', ') || '';
  const outstationAllowed = user.availability?.outstation ? 'Allowed' : 'Not Allowed';
  const workHours = `${user.availability?.time_from || '06:00'} to ${user.availability?.time_to || '22:00'}`;
  const maxRadius = user.availability?.max_radius_km || 50;
  const minBookingHrs = user.availability?.min_booking_hrs || 4;
  const availableDays = user.availability?.days?.map(d => d.toUpperCase()).join(', ') || 'ALL DAYS';
  const experienceVehicles = user.experience?.vehicle_types || [];
  const languages = user.experience?.languages || [];

  const css = `
    @keyframes pulseSOS { 0%,100%{box-shadow:0 0 10px #ff4d4d} 50%{box-shadow:0 0 25px #ff1a1a} }
    .sos-btn { animation: pulseSOS 1.5s infinite; }
  `;

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>{css}</style>

      {/* Top Header Navbar */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(3, 20, 39, 0.85)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#00dbe7', letterSpacing: '-0.5px' }}>Vaygo</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(0,219,231,0.08)', color: '#00dbe7', border: '1px solid rgba(0,219,231,0.2)' }}>
              {userRole === 'PASSENGER' ? 'Passenger' :
               userRole === 'DRIVER_PLANNED' ? 'Planned Trip Driver' :
               userRole === 'DRIVER_HIRE' ? 'Flexible Hire Driver' :
               userRole === 'DRIVER_ON_DEMAND' ? 'Driver on Demand' : userRole}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#00dbe7' }}>person</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{userFullName}</span>
            </div>
            
            <button onClick={handleLogout}
              style={{ padding: '6px 14px', background: 'transparent', color: 'rgba(255,77,77,0.80)', border: '1px solid rgba(255,77,77,0.20)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,77,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >Logout</button>
          </div>

        </div>
      </header>

      {/* Fetch error banner */}
      {fetchError && (
        <div style={{ maxWidth: 1240, margin: '16px auto 0', padding: '0 24px' }}>
          <div style={{ padding: '10px 16px', borderRadius: 8, background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)', color: '#ffb84d', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>wifi_off</span>
            {fetchError}
          </div>
        </div>
      )}

      {/* Main Grid View */}
      <main style={{ flex: 1, maxWidth: 1240, width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Verification Alert Banner for pending drivers */}
        {userRole !== 'PASSENGER' && userStatus === 'PENDING' && (
          <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)', color: '#ffb84d', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>pending_actions</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Verification Pending Approval</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>Our safety audits are currently checking your details. You will automatically receive a notification.</div>
            </div>
          </div>
        )}

        {/* Dynamic Panels */}

        {/* ── PASSENGER PANEL ── */}
        {userRole === 'PASSENGER' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }}>
            
            {/* Left section: Bookings & Maps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Ride Search Box */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>Find your Ride</h3>
                
                {/* Mode tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10 }}>
                  {[
                    { id: 'planned', label: '🚗 Planned Trip', sub: 'Scheduled' },
                    { id: 'hire', label: '🚙 Flexible Hire', sub: 'Family Owner' },
                    { id: 'driver', label: '👨‍✈️ Hire Driver', sub: 'On-Demand' }
                  ].map((t) => (
                    <button key={t.id} onClick={() => setRideType(t.id)}
                      style={{ flex: 1, padding: '10px 8px', borderRadius: 8, background: rideType === t.id ? '#00dbe7' : 'transparent', color: rideType === t.id ? '#002022' : 'rgba(211,228,254,0.50)', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearchRide} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'rgba(211,228,254,0.40)' }}>location_on</span>
                    <input type="text" placeholder="Where are you heading?" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} required
                      style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
                  </div>
                  
                  <button type="submit" disabled={rideBooked}
                    style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: rideBooked ? 'not-allowed' : 'pointer', boxShadow: '0 0 16px rgba(0,219,231,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {rideBooked ? 'Finding Matches...' : 'Request Travel Model'}
                  </button>
                </form>
              </div>

              {/* Map Canvas Mockup */}
              <div style={{ position: 'relative', height: 260, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'radial-gradient(circle, rgba(0,219,231,0.05) 10%, transparent 80%), #051a30', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(0,219,231,0.25)', animation: 'glowPulse 3s infinite' }}>map</span>
                <span style={{ fontSize: 13, color: 'rgba(211,228,254,0.40)', position: 'absolute', bottom: 16 }}>Live GPS Simulation Grid</span>
                
                {/* Mock ride icon */}
                <div style={{ position: 'absolute', top: '40%', left: '45%', width: 22, height: 22, borderRadius: '50%', background: '#00dbe7', border: '3px solid #031427', boxShadow: '0 0 10px #00dbe7' }} />
                <div style={{ position: 'absolute', top: '30%', left: '55%', width: 14, height: 14, borderRadius: '50%', background: '#ff4d4d', border: '2px solid #031427' }} />
              </div>

            </div>

            {/* Right section: Side info & Emergency SOS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Emergency SOS card */}
              <div style={{ background: 'rgba(255,77,77,0.05)', border: '1px solid rgba(255,77,77,0.15)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#ff4d4d', marginBottom: 12 }}>emergency_home</span>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#ff8080', marginBottom: 8 }}>Vaygo Safety SOS Panel</h4>
                <p style={{ fontSize: 12, color: 'rgba(211,228,254,0.50)', marginBottom: 20, lineHeight: 1.5 }}>
                  In danger? Tap button below to alert police, AI monitors, and your contact: 
                  <strong style={{ display: 'block', color: '#ff8080', marginTop: 4 }}>
                    {emergencyName} ({emergencyPhone})
                  </strong>
                </p>
                <button onClick={triggerSOS} disabled={activeSOS} className="sos-btn"
                  style={{ width: '100%', padding: '14px', background: '#ff3333', color: '#ffffff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                  <span className="material-symbols-outlined">crisis_alert</span>
                  {activeSOS ? 'Sending Alarms...' : 'TRIGGER SOS'}
                </button>
              </div>

              {/* Aadhaar Badge Indicator */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#00dbe7' }}>shield_with_heart</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>Aadhaar Verification Status</div>
                  <div style={{ fontSize: 12, color: '#00dbe7', marginTop: 3, fontWeight: 600 }}>Optional Verified Badge (Active)</div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── PLANNED / FLEXIBLE DRIVER PANEL ── */}
        {(userRole === 'DRIVER_PLANNED' || userRole === 'DRIVER_HIRE') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }}>
            
            {/* Left section: Ride requests & Duty Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Quick Actions for Drivers */}
              <div style={{ background: 'linear-gradient(135deg, rgba(0,219,231,0.1) 0%, rgba(0,100,120,0.05) 100%)', border: '1px solid rgba(0,219,231,0.2)', borderRadius: 16, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button onClick={() => navigate('/driver-dashboard/create-ride')}
                    style={{ padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#d3e4fe', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                    <span className="material-symbols-outlined" style={{ color: '#00dbe7' }}>add_circle</span>
                    Post a Ride
                  </button>
                  <button onClick={() => navigate('/driver-dashboard/rides')}
                    style={{ padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#d3e4fe', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                    <span className="material-symbols-outlined" style={{ color: '#00dbe7' }}>directions_car</span>
                    Manage My Rides
                  </button>
                </div>
              </div>

              {/* Go Online/Offline header */}
              <div style={{ padding: 20, borderRadius: 16, background: isOnline ? 'rgba(0,219,231,0.05)' : 'rgba(255,255,255,0.02)', border: isOnline ? '1px solid rgba(0,219,231,0.20)' : '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 28, color: isOnline ? '#00dbe7' : 'rgba(211,228,254,0.30)' }}>wifi_tethering</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>Duty Status</div>
                    <div style={{ fontSize: 12, color: isOnline ? '#00dbe7' : 'rgba(211,228,254,0.40)', marginTop: 2 }}>{isOnline ? 'Online - Receiving local trip calls' : 'Offline - Off duty'}</div>
                  </div>
                </div>
                <button onClick={() => setIsOnline(!isOnline)}
                  style={{ padding: '8px 16px', background: isOnline ? '#ff4d4d' : 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: isOnline ? '#ffffff' : '#002022', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
              </div>

              {/* Passenger Requests Panel */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>
                  {userRole === 'DRIVER_PLANNED' ? 'Your Active Planned Trips' : 'Live Flexible Hire Bookings'}
                </h3>
                
                {isOnline ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {userRole === 'DRIVER_PLANNED' ? (
                      realRides.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(211,228,254,0.4)' }}>No planned trips yet. Post a ride to get started!</div>
                      ) : (
                        realRides.map(ride => (
                          <div key={ride._id} style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>{ride.from} → {ride.to}</div>
                              <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', marginTop: 4 }}>Date: {new Date(ride.date).toLocaleDateString()} at {ride.time}</div>
                              <div style={{ fontSize: 11, color: '#00dbe7', marginTop: 4, fontWeight: 600 }}>{ride.bookedSeats} / {ride.seats} Seats Booked</div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <span style={{ fontSize: 16, fontWeight: 800, color: '#00dbe7' }}>₹{ride.pricePerSeat}/seat</span>
                              <button onClick={() => navigate(`/driver-dashboard/ride/${ride._id}/passengers`)}
                                style={{ padding: '6px 12px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                View Passengers
                              </button>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      [
                        { passenger: 'Priya Nair', route: 'Viman Nagar to Pune Airport', model: 'Flexible Hire (One-way)', time: 'Immediate Departure', fare: '₹480' },
                        { passenger: 'Shreya Patil', route: 'Pune to Mumbai Lonavala Stop', model: 'Flexible Hire (Outstation)', time: 'Starts at 11:30 AM', fare: '₹2,600' }
                      ].map((req, idx) => (
                        <div key={idx} style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>{req.passenger}</div>
                            <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', marginTop: 4 }}>Route: {req.route}</div>
                            <div style={{ fontSize: 11, color: '#00dbe7', marginTop: 4, fontWeight: 600 }}>{req.model} · {req.time}</div>
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: '#00dbe7' }}>{req.fare}</span>
                            <button onClick={() => alert(`Ride request accepted! Connecting with passenger...`)}
                              style={{ padding: '6px 12px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                              Accept
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(211,228,254,0.30)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8 }}>wifi_off</span>
                    <div>Go online to start receiving passenger requests.</div>
                  </div>
                )}
              </div>

            </div>

            {/* Right section: Driver profile stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Earnings card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(211,228,254,0.40)', letterSpacing: '0.06em', marginBottom: 16 }}>TODAY'S EARNINGS</h4>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#00dbe7', letterSpacing: '-1px' }}>₹1,450</div>
                <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)', marginTop: 6 }}>Completed: 3 Trips · 5.2 hrs</div>
              </div>

              {/* Vehicle info card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.40)', marginBottom: 12 }}>REGISTERED VEHICLE</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,219,231,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00dbe7' }}>
                    <span className="material-symbols-outlined">directions_car</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>
                      {vehicleBrand} {vehicleModel} ({vehicleType})
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>
                      Number: {vehicleNumber} · Capacity: {vehicleSeats} Seats
                    </div>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, color: 'rgba(211,228,254,0.50)' }}>
                  <div>Fuel: <span style={{ color: '#00dbe7', fontWeight: 600 }}>{vehicleFuel.toUpperCase()}</span></div>
                  <div>AC: <span style={{ color: '#00dbe7', fontWeight: 600 }}>{vehicleAC ? 'Yes' : 'No'}</span></div>
                  <div>Luggage: <span style={{ color: '#00dbe7', fontWeight: 600 }}>{vehicleLuggage.toUpperCase()}</span></div>
                </div>
              </div>

              {/* Configure pricing for Flexible Driver */}
              {userRole === 'DRIVER_HIRE' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#00dbe7', marginBottom: 16, letterSpacing: '0.04em' }}>CONFIGURE HIRE CHARGES</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(211,228,254,0.45)', display: 'block', marginBottom: 6 }}>Hourly Rate (₹)</label>
                      <input type="number" value={rates.hourly} onChange={e => setRates({ ...rates, hourly: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(211,228,254,0.45)', display: 'block', marginBottom: 6 }}>Per KM Rate (₹)</label>
                      <input type="number" value={rates.km} onChange={e => setRates({ ...rates, km: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                    </div>
                    <button onClick={handleSaveRates}
                      style={{ padding: '10px', background: 'rgba(0,219,231,0.08)', border: '1px solid #00dbe7', borderRadius: 8, color: '#00dbe7', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                      Save Hire Charges
                    </button>
                  </div>
                </div>
              )}

              {/* Availability & Radius panel for Flexible Hire */}
              {userRole === 'DRIVER_HIRE' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.40)', marginBottom: 12 }}>AVAILABILITY & SERVICE AREA</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                    <div>Service Cities: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{preferredCities}</span></div>
                    <div>Max Radius: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{maxRadius} KM</span></div>
                    <div>Working Hours: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{workHours}</span></div>
                    <div>Min Booking: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{minBookingHrs} hrs</span></div>
                    <div>Outstation Trips: <span style={{ color: '#00dbe7', fontWeight: 600 }}>{outstationAllowed}</span></div>
                    <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>Days: {availableDays}</div>
                  </div>
                </div>
              )}

              {/* Carpool Preference highlights for Planned Driver */}
              {userRole === 'DRIVER_PLANNED' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.40)', marginBottom: 12 }}>CARPOOL PREFERENCES</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00dbe7' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
                      <span>Verified Aadhaar Commute Access</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00dbe7' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>health_and_safety</span>
                      <span>Safety Score: {user.account?.safety_score || 100} / 100</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(211,228,254,0.50)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>nest_heat_link_gen_3</span>
                      <span>Max 1 planned ride scheduled per day</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ── DRIVER ON DEMAND PANEL ── */}
        {userRole === 'DRIVER_ON_DEMAND' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }}>
            
            {/* Left section: Client Gig requests & Preferences */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Duty toggle */}
              <div style={{ padding: 20, borderRadius: 16, background: isOnline ? 'rgba(0,219,231,0.05)' : 'rgba(255,255,255,0.02)', border: isOnline ? '1px solid rgba(0,219,231,0.20)' : '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 28, color: isOnline ? '#00dbe7' : 'rgba(211,228,254,0.30)' }}>hail</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>Gig Availability</div>
                    <div style={{ fontSize: 12, color: isOnline ? '#00dbe7' : 'rgba(211,228,254,0.40)', marginTop: 2 }}>{isOnline ? 'Online - Receiving booking invites' : 'Offline - Off duty'}</div>
                  </div>
                </div>
                <button onClick={() => setIsOnline(!isOnline)}
                  style={{ padding: '8px 16px', background: isOnline ? '#ff4d4d' : 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: isOnline ? '#ffffff' : '#002022', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
              </div>

              {/* Booking invitations list */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>Available Driver-on-Demand Bookings</h3>
                
                {isOnline ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { client: 'Sanjay Deshmukh', vehicle: 'Drive: Toyota Fortuner (SUV)', duration: '6 hrs shift (Local)', rate: '₹900 + Outstation Allowance', date: 'Today, starts at 02:00 PM' },
                      { client: 'Meera Sen', vehicle: 'Drive: Honda City (Sedan)', duration: '12 hrs shift (Outstation)', rate: '₹1,800 + KM Charges', date: 'Tomorrow, Starts at 06:00 AM' }
                    ].map((gig, idx) => (
                      <div key={idx} style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>{gig.client}</div>
                          <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', marginTop: 4 }}>Vehicle: {gig.vehicle}</div>
                          <div style={{ fontSize: 11, color: '#00dbe7', marginTop: 4, fontWeight: 600 }}>{gig.duration} · {gig.date}</div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#00dbe7' }}>{gig.rate}</span>
                          <button onClick={() => alert(`Invite accepted! Contacting car owner Sanjay...`)}
                            style={{ padding: '6px 12px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                            Accept Gig
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(211,228,254,0.30)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8 }}>notifications_off</span>
                    <div>Go online to start receiving booking invitations.</div>
                  </div>
                )}
              </div>

            </div>

            {/* Right section: Charges configuration & experience summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Rate configuration panel */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#00dbe7', marginBottom: 16, letterSpacing: '0.04em' }}>CONFIGURE SERVICE CHARGES</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, color: 'rgba(211,228,254,0.45)', display: 'block', marginBottom: 6 }}>Hourly Rate (₹)</label>
                    <input type="number" value={rates.hourly} onChange={e => setRates({ ...rates, hourly: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'rgba(211,228,254,0.45)', display: 'block', marginBottom: 6 }}>Rate Per Trip (₹)</label>
                    <input type="number" value={rates.km} onChange={e => setRates({ ...rates, km: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                  </div>
                  <button onClick={handleSaveRates}
                    style={{ padding: '10px', background: 'rgba(0,219,231,0.08)', border: '1px solid #00dbe7', borderRadius: 8, color: '#00dbe7', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                    Save Charges
                  </button>
                </div>
              </div>

              {/* Availability & experience highlights */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.40)', marginBottom: 12 }}>WORK PREFERENCES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                  <div>Cities: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{preferredCities}</span></div>
                  <div>Hours: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{workHours}</span></div>
                  <div>Outstation Work: <span style={{ color: '#00dbe7', fontWeight: 600 }}>{outstationAllowed}</span></div>
                  <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>Available Days: {availableDays}</div>
                </div>
              </div>

              {/* Experience summary card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.40)', marginBottom: 12 }}>CREDENTIAL BADGES</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#00dbe7' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified_user</span>
                    Aadhaar verified badge
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#00dbe7' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>police</span>
                    Background check cleared
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#00dbe7' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>
                    Rating: 4.95 (Highly trusted)
                  </div>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, fontSize: 11, color: 'rgba(211,228,254,0.50)' }}>
                    <div>Experience: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{yearsDriving} Years driving</span></div>
                    <div style={{ marginTop: 4 }}>Can drive: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{experienceVehicles.map(v => v.toUpperCase()).join(', ')}</span></div>
                    <div style={{ marginTop: 4 }}>Languages: <span style={{ color: '#d3e4fe', fontWeight: 600 }}>{languages.join(', ')}</span></div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
      
      {/* Mini Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px', textAlign: 'center', fontSize: 12, color: 'rgba(211,228,254,0.20)' }}>
        © 2025 Vaygo · Aadhaar-protected Mobility Hub
      </footer>

    </div>
  );
}
