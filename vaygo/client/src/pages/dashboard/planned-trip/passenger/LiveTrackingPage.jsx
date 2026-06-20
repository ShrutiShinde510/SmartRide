import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiGet } from '../../../../utils/api';
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet Icons
const pickupIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#fff; width: 20px; height: 20px; border-radius: 50%; border: 4px solid #10b981; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);'></div>",
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const driverIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='position: relative; width: 40px; height: 40px;'>
          <div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; border-radius: 50%; background: #00dbe7; border: 3px solid white; box-shadow: 0 0 10px rgba(0,219,231,0.5); z-index: 2; display: flex; align-items: center; justify-content: center;'><span class="material-symbols-outlined" style="font-size: 14px; color: white;">directions_car</span></div>
          <div style='position: absolute; top: 0; left: 50%; transform: translate(-50%, -100%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 16px solid rgba(0,219,231,0.8); z-index: 1;'></div>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

export default function LiveTrackingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      const { ok, data } = await apiGet(`/api/bookings/${bookingId}`);
      if (ok && data.success) {
        setBooking(data.booking);
      }
    }
    fetchBooking();
  }, [bookingId]);

  if (!booking) return <div style={{ background: '#f8fafc', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Connecting to GPS...</div>;

  const startLoc = booking.rideId?.startLocation ? [booking.rideId.startLocation.lat, booking.rideId.startLocation.lng] : [18.5204, 73.8567]; // fallback to Pune
  const driverLoc = booking.rideId?.startLocation ? [booking.rideId.startLocation.lat - 0.005, booking.rideId.startLocation.lng - 0.005] : [18.515, 73.850]; // Mock driver a bit away

  return (
    <div style={{ position: 'relative', height: '100dvh', width: '100%', background: '#f8fafc', overflow: 'hidden' }}>
      
      {/* Full Screen Map Container */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <MapContainer 
          center={driverLoc} 
          zoom={14}
          zoomControl={false}
          style={{ height: '100%', width: '100%', background: '#e2e8f0' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker position={startLoc} icon={pickupIcon} />
          <Marker position={driverLoc} icon={driverIcon} />
          <Polyline positions={[driverLoc, startLoc]} color="#00dbe7" weight={4} dashArray="8, 8" />
        </MapContainer>
      </div>

      {/* Top Bar overlays map */}
      <div style={{ position: 'absolute', top: 20, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1000 }}>
        <button onClick={() => navigate(-1)} style={{ flexShrink: 0, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: 'calc(100% - 60px)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#10b981' }}>schedule</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pickup in 12 mins</span>
        </div>
      </div>

      {/* Bottom Panel overlay */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: isPanelExpanded ? '24px 20px' : '16px 20px', boxShadow: '0 -4px 24px rgba(0,0,0,0.1)', zIndex: 1000, transition: 'all 0.3s ease' }}>
        
        {/* Drag Handle / Toggle Button */}
        <div 
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer', paddingBottom: 16 }}
        >
          <div style={{ width: 40, height: 5, background: '#cbd5e1', borderRadius: 3, transition: 'background 0.2s' }}></div>
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPanelExpanded ? 20 : 0 }}>
            <div onClick={() => !isPanelExpanded && setIsPanelExpanded(true)} style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: isPanelExpanded ? 'default' : 'pointer' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#00dbe7' }}>person</span>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{booking.rideId?.driverId?.personal_info?.full_name || 'Driver'}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{booking.rideId?.driverId?.vehicle?.model || 'Car'} • {booking.rideId?.driverId?.vehicle?.registration_no || 'MH 12 AB 1234'}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setIsPanelExpanded(!isPanelExpanded)} style={{ width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', border: 'none', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                  {isPanelExpanded ? 'expand_more' : 'expand_less'}
                </span>
              </button>
            </div>
          </div>

          <div style={{ 
            maxHeight: isPanelExpanded ? 500 : 0, 
            opacity: isPanelExpanded ? 1 : 0, 
            overflow: 'hidden', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <span className="material-symbols-outlined" style={{ color: '#10b981', fontSize: 24 }}>pin_drop</span>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Pickup Location</div>
                  <div style={{ fontSize: 15, color: '#0f172a', fontWeight: 700, marginTop: 2 }}>{booking.rideId?.from || 'Pickup Location'}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => navigate(`/dashboard/booking/${bookingId}/chat`)}
                  style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d3e4fe', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chat</span> Message
                </button>
                <a href={booking.rideId?.driverId?.personal_info?.phone ? `tel:${booking.rideId.driverId.personal_info.phone}` : '#'}
                  onClick={(e) => {
                    if (!booking.rideId?.driverId?.personal_info?.phone) {
                      e.preventDefault();
                      alert('Phone number not available');
                    }
                  }}
                  style={{ flex: 1, padding: '12px', background: 'rgba(0,219,231,0.1)', border: '1px solid rgba(0,219,231,0.3)', color: '#00dbe7', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>call</span> Call
                </a>
              </div>

              <button onClick={() => navigate(`/dashboard/booking/${bookingId}/rate`)} style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
                Cancel Ride
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
