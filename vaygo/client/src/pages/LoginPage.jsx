import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user details
      localStorage.setItem('vaygo_token', data.token);
      localStorage.setItem('vaygo_user', JSON.stringify(data.user));

      // Redirect to Dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowX: 'hidden', position: 'relative' }}>
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      {/* Atmospheric Glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(0,219,231,0.05)', filter: 'blur(100px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 450 }}>
        <div style={{ background: 'rgba(11,28,48,0.80)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.40)' }}>
          
          {/* Header */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px', marginBottom: 6 }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.40)' }}>
              Enter your Vaygo credentials to log in
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Phone */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>PHONE NUMBER</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(211,228,254,0.40)', fontWeight: 600 }}>+91</span>
                <input name="phone" type="tel" placeholder="98765 43210" value={form.phone} onChange={handleChange} required pattern="[0-9]{10}"
                  style={{ width: '100%', padding: '12px 14px 12px 46px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(211,228,254,0.30)' }}>lock</span>
                <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            {/* Forgot password simulator link */}
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <span style={{ fontSize: 12, color: '#00dbe7', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,77,77,0.10)', border: '1px solid rgba(255,77,77,0.22)', color: '#ff8080', fontSize: 13 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(0,219,231,0.25)', transition: 'opacity 0.2s, transform 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1, marginTop: 8 }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.88'; } }}
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? 0.7 : '1'; }}
            >
              {loading ? (
                <>Logging in...</>
              ) : (
                <>
                  <span>Log In</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </>
              )}
            </button>

            {/* Register Link */}
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'rgba(211,228,254,0.40)' }}>
              Don't have an account?{' '}
              <Link to="/role-select" style={{ color: '#00dbe7', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
