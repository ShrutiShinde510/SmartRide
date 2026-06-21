import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../../../utils/api';
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const pickupIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#000; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #fbbf24; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5);'><span class='material-symbols-outlined' style='font-size: 16px; color: #fbbf24;'>person</span></div>",
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const driverIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='position: relative; width: 40px; height: 40px;'>
          <div class='pulse-circle'></div>
          <div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border-radius: 50%; background: #00dbe7; border: 4px solid white; box-shadow: 0 0 10px rgba(0,219,231,0.5); z-index: 2;'></div>
          <div style='position: absolute; top: 0; left: 50%; transform: translate(-50%, -100%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 20px solid rgba(0,219,231,0.4); z-index: 1;'></div>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

export default function NavigationPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  useEffect(() => {
    async function fetchRide() {
      const { ok, data } = await apiGet(`/api/rides/${rideId}`);
      if (ok && data.success) {
        setRide(data.ride);
      }
    }
    fetchRide();
  }, [rideId]);

  if (!ride) return <div style={{ color: '#64748b', textAlign: 'center', padding: 40, height: '100vh', background: '#f8fafc' }}>Loading map...</div>;

  const startLoc = ride.startLocation ? [ride.startLocation.lat, ride.startLocation.lng] : [18.7, 73.5];
  const endLoc = ride.endLocation ? [ride.endLocation.lat, ride.endLocation.lng] : [19.0760, 72.8777];

  return (
    <div style={{ height: '100dvh', width: '100%', background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
      
      {/* Top Turn-by-Turn Instruction */}
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1000, display: 'flex', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ flexShrink: 0, background: '#fff', border: 'none', borderRadius: 12, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
        </button>
        <div style={{ flex: 1, background: '#10b981', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
          <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#fff' }}>turn_right</span>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1 }}>200 m</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginTop: 4 }}>Turn right onto JM Road</div>
          </div>
        </div>
      </div>

      {/* Full Screen Map */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <MapContainer 
          center={startLoc} 
          zoom={15}
          zoomControl={false}
          style={{ height: '100%', width: '100%', background: '#e2e8f0' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          />
          {/* Active Navigation Path */}
          <Polyline positions={[ startLoc, endLoc ]} color="#3b82f6" weight={8} lineCap="round" />
          
          {/* Destination */}
          <Marker position={endLoc} icon={pickupIcon} />
          
          {/* Driver Location (Self) */}
          <Marker position={startLoc} icon={driverIcon} />
        </MapContainer>
        <style>{`
          .pulse-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(0,219,231,0.5);
            animation: pulse-anim 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 0;
          }
          @keyframes pulse-anim {
            0% { width: 20px; height: 20px; opacity: 1; }
            100% { width: 80px; height: 80px; opacity: 0; }
          }
        `}</style>
      </div>

      {/* Floating Speed & Limits */}
      <div style={{ position: 'absolute', right: 16, bottom: 250, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 10 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', border: '4px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 16, fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>60</div>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontSize: 16, fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>45</div>
      </div>

      {/* Bottom Panel */}
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
            <div onClick={() => !isPanelExpanded && setIsPanelExpanded(true)} style={{ cursor: isPanelExpanded ? 'default' : 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontSize: isPanelExpanded ? 32 : 24, fontWeight: 900, color: '#10b981', letterSpacing: '-0.5px', transition: 'all 0.3s ease' }}>12 <span style={{ fontSize: isPanelExpanded ? 16 : 14, color: '#059669', fontWeight: 700 }}>min</span></div>
              </div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 2, fontWeight: 600 }}>3.2 km • ETA 08:42 AM</div>
            </div>
            
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setIsPanelExpanded(!isPanelExpanded)} style={{ width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', border: 'none', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                  {isPanelExpanded ? 'expand_more' : 'expand_less'}
                </span>
              </button>
            </div>
          </div>

          {/* Expanded Content */}
          <div style={{ 
            maxHeight: isPanelExpanded ? 500 : 0, 
            opacity: isPanelExpanded ? 1 : 0, 
            overflow: 'hidden', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
          }}>
            {/* Passenger/Driver Info Card */}
            <div style={{ background: '#f8fafc', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0', marginBottom: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#4f46e5' }}>person</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px', marginBottom: 2 }}>Passengers</div>
                  <div style={{ fontSize: 16, color: '#0f172a', fontWeight: 700 }}>{ride.bookedSeats} / {ride.capacity} Booked</div>
                </div>
              </div>
              
              <button onClick={() => navigate(`/driver-dashboard/ride/${rideId}/passengers`)} style={{ padding: '8px 16px', background: '#e0e7ff', color: '#4f46e5', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none' }}>
                View Passengers
              </button>
            </div>

            {/* Action Buttons */}
            <button 
              onClick={async () => {
                try {
                  const { ok, data } = await apiPost(`/api/rides/${rideId}/complete`);
                  if (ok && data.success) {
                    navigate(`/driver-dashboard/ride/${rideId}/rate`, { replace: true });
                  } else {
                    alert('Failed to end trip: ' + (data?.message || 'Unknown error'));
                  }
                } catch (err) {
                  console.error(err);
                  alert('Error ending trip');
                }
              }} 
              style={{ width: '100%', padding: '14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>stop_circle</span> End Trip
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
