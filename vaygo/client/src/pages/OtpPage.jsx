import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('PASSENGER');
  const [devOtp, setDevOtp] = useState('');   // shown on screen in dev mode

  const inputsRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const userStr = localStorage.getItem('vaygo_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setPhone(user.personal_info?.phone || user.phone || '');
      setRole((user.account?.role || user.role || 'passenger').toUpperCase());
    }
  }, []);

  // Auto-request OTP once phone is loaded
  useEffect(() => {
    if (phone) requestOtp(phone);
  }, [phone]);

  const requestOtp = async (phoneNumber) => {
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await res.json();
      // In dev mode the server returns the OTP in the response
      if (data.otp) setDevOtp(data.otp);
    } catch (err) {
      console.error('OTP send error:', err);
    }
  };

  const handleChange = (index, value) => {
    setError('');
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputsRef[index + 1].current.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputsRef[5].current?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: fullOtp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'OTP verification failed');
        return;
      }
      // OTP verified — navigate based on role
      const userStr = localStorage.getItem('vaygo_user');
      let resolvedRole = 'passenger';
      if (userStr) {
        const user = JSON.parse(userStr);
        resolvedRole = (user.account?.role || user.role || 'passenger').toLowerCase();
      }
      navigate(resolvedRole === 'passenger' ? '/dashboard' : '/verification');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setResending(true);
    setError('');
    setDevOtp('');
    setOtp(['', '', '', '', '', '']);
    try {
      const res = await fetch('/api/otp/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setResendMsg('New OTP sent!');
        if (data.otp) setDevOtp(data.otp);
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
      setTimeout(() => setResendMsg(''), 3000);
    }
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
          <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto 20px' }}>
            We've sent a 6-digit code to <span style={{ color: '#00dbe7', fontWeight: 600 }}>+91 {phone || 'XXXXX XXXXX'}</span>
          </p>

          {/* Dev OTP hint box */}
          {devOtp && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(0,219,231,0.06)', border: '1px solid rgba(0,219,231,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(211,228,254,0.60)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#00dbe7' }}>developer_mode</span>
                Dev OTP
              </div>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#00dbe7', letterSpacing: 4 }}>{devOtp}</span>
              <button
                onClick={() => setOtp(devOtp.split(''))}
                style={{ background: 'rgba(0,219,231,0.10)', border: '1px solid rgba(0,219,231,0.25)', borderRadius: 6, color: '#00dbe7', fontSize: 11, fontWeight: 700, padding: '4px 10px', cursor: 'pointer' }}
              >
                Fill
              </button>
            </div>
          )}

          <form onSubmit={handleVerify}>
            {/* OTP Inputs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputsRef[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  style={{
                    width: 48, height: 56,
                    background: 'rgba(255,255,255,0.03)',
                    border: digit ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12, textAlign: 'center',
                    fontSize: 20, fontWeight: 700, color: '#00dbe7',
                    outline: 'none',
                    boxShadow: digit ? '0 0 12px rgba(0,219,231,0.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,77,77,0.10)', border: '1px solid rgba(255,77,77,0.22)', color: '#ff8080', fontSize: 13, marginBottom: 20, textAlign: 'left' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}

            {/* Resend success */}
            {resendMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(0,219,231,0.06)', border: '1px solid rgba(0,219,231,0.20)', color: '#00dbe7', fontSize: 13, marginBottom: 20, textAlign: 'left' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                {resendMsg}
              </div>
            )}

            {/* Verify button */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(0,219,231,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? '0.7' : '1'; }}
            >
              {loading ? 'Verifying...' : (
                <>
                  <span>Verify OTP</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
                </>
              )}
            </button>

            {/* Resend */}
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(211,228,254,0.40)' }}>
              Didn't receive code?{' '}
              <span
                style={{ color: resending ? 'rgba(0,219,231,0.40)' : '#00dbe7', cursor: resending ? 'default' : 'pointer', fontWeight: 600 }}
                onClick={!resending ? handleResend : undefined}
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </span>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
