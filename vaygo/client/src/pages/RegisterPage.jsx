import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('PASSENGER');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    gender: 'MALE',
    city: '',
    state: '',
    emergencyName: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    const savedRole = sessionStorage.getItem('vaygo_role');
    const savedLang = sessionStorage.getItem('vaygo_language');
    if (savedRole) setRole(savedRole);
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isPassenger = role.toUpperCase() === 'PASSENGER';
      const body = {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password,
        gender: form.gender.toLowerCase(),
        role: role.toLowerCase(),
        language: language,
        city: isPassenger ? form.city : undefined,
        state: isPassenger ? form.state : undefined
      };

      if (isPassenger) {
        body.emergency_contact = {
          name: form.emergencyName,
          phone: form.emergencyPhone
        };
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user
      localStorage.setItem('vaygo_token', data.token);
      localStorage.setItem('vaygo_user', JSON.stringify(data.user));

      // Redirect to OTP page
      navigate('/otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    const r = role.toUpperCase();
    if (r === 'PASSENGER') return 'Passenger';
    if (r === 'DRIVER_PLANNED') return 'Planned Trip Driver';
    if (r === 'DRIVER_HIRE') return 'Flexible Hire Driver';
    return 'Driver on Demand';
  };

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowX: 'hidden', position: 'relative' }}>
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      {/* Atmospheric Glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(0,219,231,0.05)', filter: 'blur(100px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        <div style={{ background: 'rgba(11,28,48,0.80)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.40)' }}>
          
          {/* Header */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px', marginBottom: 6 }}>
              Create your Account
            </h2>
            <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 99, background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.20)', color: '#00dbe7', fontSize: 12, fontWeight: 700 }}>
              {getRoleLabel()} Mode
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Full Name */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(211,228,254,0.30)' }}>person</span>
                <input name="name" type="text" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} required
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>PHONE NUMBER</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(211,228,254,0.40)', fontWeight: 600 }}>+91</span>
                <input name="phone" type="tel" placeholder="98765 43210" value={form.phone} onChange={handleChange} required pattern="[0-9]{10}" title="Ten digit mobile number"
                  style={{ width: '100%', padding: '12px 14px 12px 46px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>EMAIL (OPTIONAL)</label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(211,228,254,0.30)' }}>mail</span>
                <input name="email" type="email" placeholder="rahul@email.com" value={form.email} onChange={handleChange}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(211,228,254,0.30)' }}>lock</span>
                <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>GENDER</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['MALE', 'FEMALE', 'OTHER'].map(g => (
                  <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                    style={{ flex: 1, padding: '10px', background: form.gender === g ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)', border: form.gender === g ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: form.gender === g ? '#00dbe7' : 'rgba(211,228,254,0.60)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Passenger Specific Fields: City and State */}
            {role.toUpperCase() === 'PASSENGER' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>CITY</label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(211,228,254,0.30)' }}>location_city</span>
                    <input name="city" type="text" placeholder="Pune" value={form.city} onChange={handleChange} required
                      style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>STATE</label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(211,228,254,0.30)' }}>map</span>
                    <input name="state" type="text" placeholder="Maharashtra" value={form.state} onChange={handleChange} required
                      style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, color: '#d3e4fe', fontSize: 14, outline: 'none' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Passenger Specific Fields: Emergency Contact */}
            {role.toUpperCase() === 'PASSENGER' && (
              <div style={{ marginTop: 8, padding: '16px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 12 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>emergency</span>
                  EMERGENCY CONTACT INFO
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input name="emergencyName" type="text" placeholder="Contact Person Name" value={form.emergencyName} onChange={handleChange} required
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                  <input name="emergencyPhone" type="tel" placeholder="Contact Person Phone" value={form.emergencyPhone} onChange={handleChange} required pattern="[0-9]{10}"
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                </div>
              </div>
            )}

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
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? '0.7' : '1'; }}
            >
              {loading ? (
                <>Simulating Registration...</>
              ) : (
                <>
                  <span>Register</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </>
              )}
            </button>

            {/* Login Link */}
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'rgba(211,228,254,0.40)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#00dbe7', textDecoration: 'none', fontWeight: 600 }}>Log In</Link>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
