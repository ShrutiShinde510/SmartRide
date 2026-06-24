import { useNavigate } from 'react-router-dom';

export default function HireSetupPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Unlock "Driver on Demand"</h2>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ color: 'rgba(211,228,254,0.7)', fontSize: 14, marginBottom: 20 }}>
          To drive for families in their own cars, you must meet the high-trust criteria.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: 16, background: 'rgba(0,219,231,0.05)', border: '1px solid #00dbe7', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#00dbe7' }}>check_circle</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>20+ Completed Rides</div>
              <div style={{ fontSize: 12, color: '#00dbe7' }}>Achieved (42 rides)</div>
            </div>
          </div>
          
          <div style={{ padding: 16, background: 'rgba(251,191,36,0.05)', border: '1px solid #fbbf24', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#fbbf24' }}>pending</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>Police Clearance Certificate</div>
              <div style={{ fontSize: 12, color: '#fbbf24' }}>Upload Required</div>
            </div>
          </div>
        </div>

        <button onClick={() => {
          alert('Certificate uploaded and verified (mock). Welcome to Model 3!');
          navigate('/driver-dashboard/m3/dashboard');
        }} style={{ width: '100%', marginTop: 24, padding: 16, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
          Upload PCC & Unlock
        </button>
      </div>
    </div>
  );
}
