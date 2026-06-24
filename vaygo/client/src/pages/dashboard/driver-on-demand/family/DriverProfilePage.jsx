import { useParams, useNavigate } from 'react-router-dom';

export default function DriverProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Driver Profile</h2>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#00dbe7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#031427' }}>person</span>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#d3e4fe' }}>Trusted Driver</div>
            <div style={{ fontSize: 14, color: '#fbbf24', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>
              4.9 (42 Trips on Vaygo)
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00dbe7', fontSize: 14 }}>
            <span className="material-symbols-outlined">police</span>
            Police Verification Checked
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00dbe7', fontSize: 14 }}>
            <span className="material-symbols-outlined">verified_user</span>
            Aadhaar & DL Verified
          </div>
        </div>

        <button onClick={() => navigate(`/dashboard/m3/booking/confirm/${id}`)} style={{ marginTop: 24, padding: 16, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
          Request & Pay Advance
        </button>
      </div>
    </div>
  );
}
