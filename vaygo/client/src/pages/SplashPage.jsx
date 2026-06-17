import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const css = `
    @keyframes glowPulse { 0%,100%{opacity:.22;transform:scale(1)} 50%{opacity:.50;transform:scale(1.07)} }
    @keyframes fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes slideUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
    .fu1{animation:fadeUp .6s .05s ease both}
    .fu2{animation:fadeUp .6s .15s ease both}
    .fu3{animation:fadeUp .6s .25s ease both}
    .fu4{animation:fadeUp .6s .35s ease both}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{overflow-x:hidden;}
    a,button,input{font-family:inherit;}
    .material-symbols-outlined{
      font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24;
      font-size:inherit;
      display:inline-block;
      line-height:1;
    }
    .nav-link{font-size:14px;color:rgba(211,228,254,0.48);text-decoration:none;cursor:pointer;transition:color .2s;}
    .nav-link:hover{color:#00dbe7;}
    input:-webkit-autofill{
      -webkit-box-shadow:0 0 0 100px #0b1c30 inset !important;
      -webkit-text-fill-color:#d3e4fe !important;
    }
    input::placeholder{color:rgba(211,228,254,0.28);}
    input:focus{outline:none;border-color:rgba(0,219,231,0.55) !important;box-shadow:0 0 0 3px rgba(0,219,231,0.10);}
    .tab-btn{flex:1;padding:11px;font-size:14px;font-weight:600;border:none;cursor:pointer;transition:all .2s;border-radius:8px;}
  `;

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>{css}</style>

      {/* ── Atmospheric BG ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '60%', height: '60%', borderRadius: '50%', background: 'rgba(0,219,231,0.08)', filter: 'blur(120px)', animation: 'glowPulse 5s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '55%', height: '55%', borderRadius: '50%', background: 'rgba(133,211,218,0.05)', filter: 'blur(100px)', animation: 'glowPulse 5s ease-in-out infinite', animationDelay: '-2.5s' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,219,231,0.055) 1px,transparent 1px)', backgroundSize: '24px 24px', opacity: .6 }} />
      </div>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(3,20,39,0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all .3s ease',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#00dbe7', letterSpacing: '-0.5px', textShadow: '0 0 22px rgba(0,219,231,0.5)', cursor: 'default' }}>Vaygo</span>
          <div style={{ display: 'flex', gap: 36 }}>
            {['How it works', 'Safety', 'For Drivers'].map(l => (
              <span key={l} className="nav-link">{l}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/login')}
              style={{ padding: '8px 22px', background: 'transparent', color: 'rgba(211,228,254,0.65)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#d3e4fe'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(211,228,254,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
            >Log in</button>
            <button onClick={() => navigate('/onboarding')}
              style={{ padding: '8px 22px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 14px rgba(0,219,231,0.32)', transition: 'opacity .2s,transform .15s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '.85'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
            >Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60, alignItems: 'center', maxWidth: 1240, margin: '0 auto', padding: '100px 48px 80px' }}>

        {/* LEFT — Hero copy */}
        <div>
          {/* Badge */}
          <div className="fu1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.22)', color: '#00dbe7', fontSize: 12, fontWeight: 600, letterSpacing: '0.07em', marginBottom: 32 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
            NEXT-GEN MOBILITY
          </div>

          {/* Headline */}
          <h1 className="fu2" style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: '-2.5px', marginBottom: 24 }}>
            Unified<br />
            <span style={{ color: '#00dbe7', fontStyle: 'italic', textShadow: '0 0 40px rgba(0,219,231,0.45)' }}>Mobility</span><br />
            for Everyone
          </h1>

          {/* Subtext */}
          <p className="fu3" style={{ fontSize: 17, color: 'rgba(211,228,254,0.52)', lineHeight: 1.75, marginBottom: 44, maxWidth: 540 }}>
            Experience the future of transportation. One platform for on-demand rides, premium car hiring, and secure vehicle sharing — all Aadhaar-verified and AI-monitored.
          </p>

          {/* Trust row */}
          <div className="fu4" style={{ display: 'flex', gap: 24, alignItems: 'center', paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[['verified_user', 'Aadhaar KYC'], ['psychology', 'AI Safety'], ['crisis_alert', 'SOS Alert'], ['mic', 'Voice Booking']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(211,228,254,0.40)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#00dbe7' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — 3 model cards */}
        <div className="fu4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: 'schedule', label: 'Planned Trip', sub: 'Book a seat on a scheduled route', color: '#00dbe7' },
            { icon: 'directions_car', label: 'Flexible Hire', sub: 'Hire a car owner for your family', color: '#85d3da' },
            { icon: 'person_pin', label: 'Driver on Demand', sub: 'Trusted driver for your own car', color: '#74f5ff' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 16, background: 'rgba(11,28,48,0.40)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', transition: 'transform 0.2s, border-color 0.2s, background 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(0,219,231,0.25)'; e.currentTarget.style.background = 'rgba(11,28,48,0.60)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(11,28,48,0.40)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: m.color }}>{m.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#d3e4fe', letterSpacing: '-0.2px' }}>{m.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.40)', marginTop: 4 }}>{m.sub}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: '0.06em', background: `${m.color}14`, padding: '4px 12px', borderRadius: 999 }}>0{i + 1}</span>
            </div>
          ))}
        </div>
      </section>



      {/* ── Scroll indicator ── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(211,228,254,0.22)', fontSize: 10, letterSpacing: '0.18em', paddingBottom: 12 }}>
        <span>EXPLORE</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,rgba(0,219,231,0.45),transparent)' }} />
      </div>

      {/* ── Stats ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '20px 48px 60px', marginTop: '-30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
          {[
            { value: '3', label: 'Ride models', sub: 'Planned · Hire · Driver' },
            { value: '5+', label: 'Indian languages', sub: 'Hindi, Marathi & more' },
            { value: '100%', label: 'KYC verified', sub: 'Aadhaar + face match' },
            { value: 'AI', label: 'Safety monitoring', sub: 'Real-time every trip' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '32px 20px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: i === 0 ? '14px 0 0 14px' : i === 3 ? '0 14px 14px 0' : 0 }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#00dbe7', letterSpacing: '-1.5px', textShadow: '0 0 20px rgba(0,219,231,0.38)', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#d3e4fe', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.32)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#00dbe7', textShadow: '0 0 16px rgba(0,219,231,0.38)', letterSpacing: '-0.4px' }}>Vaygo</span>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Privacy', 'Terms', 'Safety', 'Support'].map(l => (
              <span key={l} style={{ fontSize: 13, color: 'rgba(211,228,254,0.32)', cursor: 'pointer', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = '#00dbe7'}
                onMouseLeave={e => e.target.style.color = 'rgba(211,228,254,0.32)'}
              >{l}</span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: 'rgba(211,228,254,0.18)' }}>© 2025 Vaygo · Made in India</span>
        </div>
      </footer>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}