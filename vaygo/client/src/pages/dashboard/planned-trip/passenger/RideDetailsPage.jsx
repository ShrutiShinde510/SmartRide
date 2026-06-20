import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { apiGet } from '../../../../utils/api';
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const startIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#00dbe7; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const endIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#ff4d4d; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

export default function RideDetailsPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seats = searchParams.get('seats') || '1';
  const [ride, setRide] = useState(null);

  useEffect(() => {
    async function fetchRide() {
      const { ok, data } = await apiGet(`/api/rides/${rideId}`);
      if (ok && data.success) {
        setRide(data.ride);
      }
    }
    fetchRide();
  }, [rideId]);

  if (!ride) return <div style={{ color: 'rgba(211,228,254,0.5)', textAlign: 'center', padding: 40 }}>Loading trip details...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px', paddingBottom: 100 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#d3e4fe' }}>Trip Details</h2>
      </div>

      {/* Map */}
      <div style={{ height: 180, borderRadius: 16, overflow: 'hidden', marginBottom: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
        {ride.startLocation && ride.endLocation ? (
          <MapContainer 
            bounds={[ [ride.startLocation.lat, ride.startLocation.lng], [ride.endLocation.lat, ride.endLocation.lng] ]} 
            zoomControl={false}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', background: '#031427' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            />
            <Marker position={[ride.startLocation.lat, ride.startLocation.lng]} icon={startIcon} />
            <Marker position={[ride.endLocation.lat, ride.endLocation.lng]} icon={endIcon} />
            <Polyline positions={[ [ride.startLocation.lat, ride.startLocation.lng], [ride.endLocation.lat, ride.endLocation.lng] ]} color="#00dbe7" dashArray="6 6" weight={3} />
          </MapContainer>
        ) : (
          <div style={{ height: '100%', background: 'radial-gradient(circle, rgba(0,219,231,0.1) 0%, #031427 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(0,219,231,0.2)' }}>map</span>
          </div>
        )}
      </div>

      {/* Driver Profile Card */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.15),rgba(0,241,254,0.05))', border: '1px solid rgba(0,219,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#00dbe7' }}>person</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#d3e4fe' }}>{ride.driverId?.personal_info?.full_name || 'Driver'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#fbbf24', marginTop: 4, fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span> {ride.driverId?.rating || '4.8'} <span style={{ color: 'rgba(211,228,254,0.4)', fontWeight: 400 }}>({ride.driverId?.experience || '12'} trips)</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 20, paddingTop: 16, display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Vehicle</div>
            <div style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{ride.driverId?.vehicle?.model || 'Car'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Color</div>
            <div style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>White</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.4)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>License</div>
            <div style={{ fontSize: 14, color: '#d3e4fe', fontWeight: 600 }}>{ride.driverId?.vehicle?.registration_no || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>Trip Itinerary</h3>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        
        <div style={{ display: 'flex', gap: 16, position: 'relative' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: 7, top: 20, bottom: 20, width: 2, background: 'rgba(255,255,255,0.1)' }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
            {/* Start */}
            <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#00dbe7', border: '4px solid #031427', marginTop: 2 }}></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>{ride.from}</div>
                <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 4 }}>{new Date(ride.date).toLocaleDateString()}, {ride.time}</div>
              </div>
            </div>

            {/* End */}
            <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#ff4d4d', border: '4px solid #031427', marginTop: 2 }}></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe' }}>{ride.to}</div>
                <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.5)', marginTop: 4 }}>Destination</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Amenities */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe', marginBottom: 16 }}>Included Amenities</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {['AC', 'Music', 'No Smoking', 'Luggage Space'].map(amenity => (
          <div key={amenity} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(211,228,254,0.7)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#00dbe7' }}>check_circle</span>
            {amenity}
          </div>
        ))}
      </div>

      {/* Fixed Bottom Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'rgba(3,20,39,0.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 600, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.5)', fontWeight: 600 }}>Total Fare ({seats} Seat{seats > 1 ? 's' : ''})</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#00dbe7' }}>₹{ride.pricePerSeat * parseInt(seats, 10)}</div>
          </div>
          <button onClick={() => navigate(`/dashboard/ride/${rideId}/payment?seats=${seats}`)}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,219,231,0.2)' }}>
            Book Seat
          </button>
        </div>
      </div>

    </div>
  );
}
