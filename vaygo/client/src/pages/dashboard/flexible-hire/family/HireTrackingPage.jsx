import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiGet } from '../../../../utils/api';

const carIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='position: relative; width: 40px; height: 40px;'>
          <div class='pulse-circle' style='background: rgba(0,219,231,0.5); animation: pulse-anim 2s infinite;'></div>
          <div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; border-radius: 50%; background: #00dbe7; border: 4px solid #111; z-index: 2; display: flex; align-items: center; justify-content: center;'><span class="material-symbols-outlined" style="font-size: 14px; color: #002022">directions_car</span></div>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

export default function HireTrackingPage() {
  const navigate = useNavigate();
  const { hireId } = useParams();
  
  const [elapsed, setElapsed] = useState(0);
  const [req, setReq] = useState(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  useEffect(() => {
    async function fetchReq() {
      try {
        const { ok, data } = await apiGet('/api/hires/my-requests');
        if (ok && data.success) {
          const found = data.requests.find(r => r._id === hireId);
          if (found) {
            setReq({
              ownerName: found.ownerId?.personal_info?.full_name || 'Driver',
              ownerPhone: found.ownerId?.personal_info?.phone || '',
              carModel: `${found.ownerId?.vehicle?.brand || ''} ${found.ownerId?.vehicle?.model || 'Car'}`.trim(),
              carReg: found.ownerId?.vehicle?.registration_no || '',
              finalPrice: found.finalPrice || 0,
              status: found.status,
              from: found.from || '',
              to: found.to || '',
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

  const ownerName = req?.ownerName || 'Loading...';
  const carModel = req?.carModel || '';
  const carReg = req?.carReg || '';
  const finalPrice = req?.finalPrice || 0;
  const ownerPhone = req?.ownerPhone || '+91 00000 00000';

  if (req && (req.status === 'completed' || req.status === 'rejected')) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0f1e', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: req.status === 'completed' ? 'rgba(0,219,231,0.1)' : 'rgba(255,77,77,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: req.status === 'completed' ? '#00dbe7' : '#ff4d4d' }}>
            {req.status === 'completed' ? 'check_circle' : 'cancel'}
          </span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 8 }}>
          Hire {req.status === 'completed' ? 'Completed' : 'Cancelled'}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(211,228,254,0.5)', marginBottom: 32, maxWidth: 300 }}>
          {req.status === 'completed' 
            ? 'This flexible hire has ended. Live tracking is no longer available.' 
            : 'This flexible hire was cancelled. Live tracking is not available.'}
        </p>
        
        {req.status === 'completed' && (
          <button onClick={() => navigate(`/dashboard/hire/final/${hireId}`)} style={{ padding: '16px 32px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', marginBottom: 16 }}>
            View Final Receipt
          </button>
        )}
        
        <button onClick={() => navigate('/dashboard/home')} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.05)', color: '#d3e4fe', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

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
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe' }}>Active Hire</div>
        </div>
        <button style={{ background: 'rgba(255,77,77,0.15)', border: '1px solid rgba(255,77,77,0.3)', color: '#ff4d4d', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>emergency</span> SOS
        </button>
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
          <Marker position={[19.0760, 72.8777]} icon={carIcon} />
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

        {/* Driver Info Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isPanelExpanded ? 24 : 0 }}>
          <div onClick={() => !isPanelExpanded && setIsPanelExpanded(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: isPanelExpanded ? 'default' : 'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #00dbe7, #006b8f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
              {ownerName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#d3e4fe' }}>{ownerName}</div>
              <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', marginTop: 2 }}>{carModel} {carReg ? `• ${carReg}` : ''}</div>
            </div>
          </div>
          <button onClick={() => setIsPanelExpanded(!isPanelExpanded)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#d3e4fe', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
              {isPanelExpanded ? 'expand_more' : 'expand_less'}
            </span>
          </button>
        </div>

        {/* Expanded Content */}
        <div style={{ 
          maxHeight: isPanelExpanded ? 600 : 0, 
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
            <a href={`tel:${ownerPhone}`} style={{ flex: 1, padding: '14px', background: 'rgba(0,219,231,0.1)', border: '1px solid rgba(0,219,231,0.2)', color: '#00dbe7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>
              <span className="material-symbols-outlined">call</span> Call Driver
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

          {/* Bill Est */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.5)', fontWeight: 600, marginBottom: 4 }}>EST. RUNNING BILL</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fbbf24' }}>₹{finalPrice}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
