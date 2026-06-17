import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('PASSENGER');
  
  const inputsRef = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const userStr = localStorage.getItem('vaygo_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setPhone(user.personal_info?.phone || user.phone || '');
      // account.role is the canonical field in our new schema
      const resolvedRole = (user.account?.role || user.role || 'passenger').toUpperCase();
      setRole(resolvedRole);
    }
  }, []);

  const handleChange = (index, value) => {
    setError('');
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 3) {
      inputsRef[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef[index - 1].current.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      setError('Please enter all 4 digits');
      setLoading(false);
      return;
    }

    // Simulate OTP network latency
    setTimeout(() => {
      setLoading(false);
      // Accept any 4-digit OTP for demo purposes
      if (fullOtp.length === 4) {
        // Read the freshest user from localStorage at click time
        const userStr = localStorage.getItem('vaygo_user');
        let resolvedRole = 'passenger';
        if (userStr) {
          const user = JSON.parse(userStr);
          resolvedRole = (user.account?.role || user.role || 'passenger').toLowerCase();
        }

        if (resolvedRole === 'passenger') {
          // Passengers: mark active and go to dashboard
          if (userStr) {
            const user = JSON.parse(userStr);
            user.status = 'ACTIVE';
            localStorage.setItem('vaygo_user', JSON.stringify(user));
          }
          navigate('/dashboard');
        } else {
          // All driver types go to verification page
          navigate('/verification');
        }
      } else {
        setError('Invalid OTP code. Enter any 4 digits to verify.');
      }
    }, 1500);
  };

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowX: 'hidden', position: 'relative' }}>
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      {/* Background Glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(0,219,231,0.04)', filter: 'blur(100px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        <div style={{ background: 'rgba(11,28,48,0.80)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.40)', textAlign: 'center' }}>
          
          {/* Header */}
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 30, color: '#00dbe7' }}>sms_failed</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px', marginBottom: 8 }}>
            Enter OTP Code
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto 28px' }}>
            We've sent a 4-digit code to your phone <span style={{ color: '#00dbe7', fontWeight: 600 }}>+91 {phone || 'XXXXX XXXXX'}</span>
          </p>

          <form onSubmit={handleVerify}>
            
            {/* OTP Inputs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 24 }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputsRef[index]}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  style={{
                    width: 58,
                    height: 58,
                    background: 'rgba(255,255,255,0.03)',
                    border: digit ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    textAlign: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#00dbe7',
                    outline: 'none',
                    boxShadow: digit ? '0 0 12px rgba(0,219,231,0.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,77,77,0.10)', border: '1px solid rgba(255,77,77,0.22)', color: '#ff8080', fontSize: 13, marginBottom: 20 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(0,219,231,0.25)', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.88'; } }}
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? 0.7 : '1'; }}
            >
              {loading ? (
                <>Verifying...</>
              ) : (
                <>
                  <span>Verify OTP</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
                </>
              )}
            </button>

            {/* Resend simulation */}
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(211,228,254,0.40)' }}>
              Didn't receive code?{' '}
              <span style={{ color: '#00dbe7', cursor: 'pointer', fontWeight: 600 }} onClick={() => setOtp(['1', '2', '3', '4'])}>
                Auto-fill (1234)
              </span>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
