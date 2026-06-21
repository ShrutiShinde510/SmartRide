import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiGet } from '../../../../utils/api';

const driverIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='position: relative; width: 40px; height: 40px;'>
          <div class='pulse-circle' style='background: rgba(0,219,231,0.5); animation: pulse-anim 2s infinite;'></div>
          <div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border-radius: 50%; background: #00dbe7; border: 4px solid #111; z-index: 2;'></div>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

export default function ActiveHirePage() {
  const navigate = useNavigate();
  const { hireId } = useParams();
  
  const [elapsed, setElapsed] = useState(0);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [req, setReq] = useState(null);

  useEffect(() => {
    async function fetchReq() {
      try {
        const { ok, data } = await apiGet('/api/hires/driver-requests');
        if (ok && data.success) {
          const found = data.requests.find(r => r._id === hireId);
          if (found) {
            setReq({
              passengerName: found.passenger?.full_name || 'Passenger',
              passengerPhone: found.passenger?.phone || '+91 90000 00000',
              finalPrice: found.finalPrice || 3000,
              from: found.from || 'Pickup',
              to: found.to || 'Dropoff',
              address: found.address || ''
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchReq();

    const timer = setInterval(() => setElapsed(e => e + 1), 60000); // mock minute tick
    return () => clearInterval(timer);
  }, [hireId]);

  const passengerName = req?.passengerName || 'Loading...';
  const passengerPhone = req?.passengerPhone || '';
  const finalPrice = req?.finalPrice || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0f1e' }}>
      <style>{`
        @keyframes pulse-anim {
          0% { width: 20px; height: 20px; opacity: 1; border-radius: 50%; }
          100% { width: 80px; height: 80px; opacity: 0; border-radius: 50%; }
        }
      `}</style>
      
      {/* App Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/driver-dashboard/owner/requests')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe' }}>Trip Navigation</div>
        </div>
        <div style={{ background: 'rgba(34,211,160,0.1)', color: '#22d3a0', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sensors</span> Live
        </div>
      </div>

      {/* Real Map Area */}
      <div style={{ flex: 1, position: 'relative', zIndex: 0 }}>
        <MapContainer 
          center={[19.0760, 72.8777]} 
          zoom={14}
          zoomControl={false}
          style={{ height: '100%', width: '100%', background: '#111' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          />
          <Marker position={[19.0760, 72.8777]} icon={driverIcon} />
        </MapContainer>
      </div>

      {/* Bottom Meter & Controls */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(10, 15, 30, 0.98)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', paddingBottom: 30, borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 1000, transition: 'all 0.3s ease' }}>
        
        {/* Drag Handle / Toggle Button */}
        <div 
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer', paddingBottom: 16 }}
        >
          <div style={{ width: 40, height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 3, transition: 'background 0.2s' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPanelExpanded ? 24 : 0 }}>
          <div onClick={() => !isPanelExpanded && setIsPanelExpanded(true)} style={{ cursor: isPanelExpanded ? 'default' : 'pointer' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#22d3a0' }}>{passengerName}</div>
            <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 2, fontWeight: 600 }}>En Route to Dropoff</div>
          </div>
          
          <button onClick={() => setIsPanelExpanded(!isPanelExpanded)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#d3e4fe', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
              {isPanelExpanded ? 'expand_more' : 'expand_less'}
            </span>
          </button>
        </div>

        {/* Expanded Content */}
        <div style={{ 
          maxHeight: isPanelExpanded ? 500 : 0, 
          opacity: isPanelExpanded ? 1 : 0, 
          overflow: 'hidden', 
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
        }}>
        
          {/* Live Meter Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.5)', fontWeight: 600, marginBottom: 4 }}>ELAPSED TIME</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe' }}>{2 + Math.floor(elapsed/60)}<span style={{ fontSize: 14 }}>h</span> {30 + (elapsed%60)}<span style={{ fontSize: 14 }}>m</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.5)', fontWeight: 600, marginBottom: 4 }}>DISTANCE DRIVEN</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe' }}>42<span style={{ fontSize: 14 }}>.5 km</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <a href={`tel:${passengerPhone}`} style={{ flex: 1, padding: '14px', background: 'rgba(34,211,160,0.1)', border: '1px solid rgba(34,211,160,0.2)', color: '#22d3a0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>
              <span className="material-symbols-outlined">call</span> Call Passenger
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="material-symbols-outlined" style={{ color: '#00dbe7', fontSize: 24 }}>trip_origin</span>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.5)', textTransform: 'uppercase', fontWeight: 800 }}>Pickup Location</div>
                <div style={{ fontSize: 15, color: '#d3e4fe', fontWeight: 700, marginTop: 2 }}>{req?.from || 'Pickup Location'}</div>
                <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginTop: 2 }}>{req?.address}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="material-symbols-outlined" style={{ color: '#ff4d4d', fontSize: 24 }}>location_on</span>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.5)', textTransform: 'uppercase', fontWeight: 800 }}>Drop Location</div>
                <div style={{ fontSize: 15, color: '#d3e4fe', fontWeight: 700, marginTop: 2 }}>{req?.to || 'Drop Location'}</div>
              </div>
            </div>
          </div>

          {/* Bill Est & Go Back */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.5)', fontWeight: 600, marginBottom: 4 }}>TOTAL RUNNING BILL</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fbbf24' }}>₹{finalPrice}</div>
            </div>
            <button onClick={() => navigate('/driver-dashboard/owner/requests')}
              style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
              Go Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
