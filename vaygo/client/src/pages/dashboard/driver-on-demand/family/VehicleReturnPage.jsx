import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VehicleReturnPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aiResult, setAiResult] = useState({
    isDamaged: false,
    confidenceScore: 98,
    notes: 'Clean'
  });

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: '#00dbe7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
        Back
      </button>
<h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', marginBottom: 24 }}>Vehicle Return Inspection</h2>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ fontSize: 16, color: '#00dbe7', marginBottom: 16 }}>AI OpenCV Damage Detection</h3>
        
        <div style={{ padding: 16, borderRadius: 12, background: aiResult.isDamaged ? 'rgba(255,77,77,0.1)' : 'rgba(0,219,231,0.1)', border: `1px solid ${aiResult.isDamaged ? '#ff4d4d' : '#00dbe7'}` }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: aiResult.isDamaged ? '#ff4d4d' : '#00dbe7', marginBottom: 4 }}>
            {aiResult.isDamaged ? 'DAMAGE DETECTED' : 'CLEAN - NO DAMAGE'}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.7)' }}>Confidence Score: {aiResult.confidenceScore}%</div>
          <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.7)', marginTop: 8 }}>{aiResult.notes}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
          <button style={{ padding: 12, background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            Raise Dispute
          </button>
          <button onClick={() => navigate(`/dashboard/m3/payment/${id}`)} style={{ padding: 12, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>
            Accept & Pay Balance
          </button>
        </div>
      </div>
    </div>
  );
}
