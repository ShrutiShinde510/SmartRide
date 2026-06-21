import { useNavigate, useParams } from 'react-router-dom';

export default function FinalPaymentPage() {
  const navigate = useNavigate();
  const { hireId } = useParams();

  const handlePay = () => {
    // Navigate to rating page after payment
    navigate(`/dashboard/hire/rate/${hireId || '123'}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px', paddingBottom: 100 }}>
      
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,219,231,0.1)', border: '2px solid rgba(0,219,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#00dbe7' }}>receipt_long</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Trip Completed</div>
        <div style={{ fontSize: 14, color: 'rgba(211,228,254,0.6)' }}>Here is your final bill summary</div>
      </div>

      {/* Invoice Card */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, color: '#000', marginBottom: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#333' }}>VAYGO FLEXIBLE HIRE</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Trip ID: #{hireId || '123456'}</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, padding: '16px 0', borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>TOTAL TIME</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#000', marginTop: 4 }}>8h 15m</div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px dashed #ccc' }}>
            <div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>TOTAL DISTANCE</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#000', marginTop: 4 }}>82 km</div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: '#444' }}>Base Package (8hrs / 80km)</span>
          <span style={{ fontSize: 14, color: '#000', fontWeight: 600 }}>₹3,000</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: '#444' }}>Extra Distance (2 km @ ₹12/km)</span>
          <span style={{ fontSize: 14, color: '#000', fontWeight: 600 }}>₹24</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: '#444' }}>Extra Time (15 mins)</span>
          <span style={{ fontSize: 14, color: '#000', fontWeight: 600 }}>₹100</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#22d3a0' }}>
          <span style={{ fontSize: 14 }}>Advance Paid</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>-₹600</span>
        </div>

        <div style={{ borderTop: '2px solid #eee', margin: '16px 0' }} />

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#000' }}>Balance Due</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#000' }}>₹2,524</span>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'rgba(10, 15, 30, 0.95)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <button onClick={handlePay} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,219,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Pay ₹2,524 via UPI
          </button>
        </div>
      </div>

    </div>
  );
}
