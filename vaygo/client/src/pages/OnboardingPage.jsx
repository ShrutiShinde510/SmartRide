import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      navigate('/language');
    }
  };

  const handleSkip = () => {
    navigate('/language');
  };

  const css = `
    @keyframes glowPulse { 0%,100%{opacity:.22;transform:scale(1)} 50%{opacity:.50;transform:scale(1.07)} }
    @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:none} }
    .slide-active { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
  `;

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>{css}</style>

      {/* Background elements */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(0,219,231,0.06)', filter: 'blur(100px)', animation: 'glowPulse 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(0,219,231,0.04)', filter: 'blur(100px)', animation: 'glowPulse 6s ease-in-out infinite', animationDelay: '-3s' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 500, padding: 32, textAlign: 'center' }}>
        
        {/* Progress Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              style={{
                width: s === step ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: s === step ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'rgba(211,228,254,0.15)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Screen Content */}
        <div className="slide-active" key={step} style={{ minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {step === 0 && (
            <div>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 0 30px rgba(0,219,231,0.15)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 42, color: '#00dbe7' }}>group</span>
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.8px', marginBottom: 16 }}>Ride Together</h2>
              <p style={{ fontSize: 16, color: 'rgba(211,228,254,0.55)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>
                Find trusted rides, matching your routes and schedules, to share travel expenses securely.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.8px', marginBottom: 24 }}>Travel Your Way</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
                {[
                  { icon: 'schedule', title: '🚗 Planned Trip', desc: 'Book a seat on a scheduled route', color: '#00dbe7' },
                  { icon: 'directions_car', title: '🚙 Flexible Hire', desc: 'Hire a car owner for your family', color: '#85d3da' },
                  { icon: 'person_pin', title: '👨‍✈️ Driver on Demand', desc: 'Trusted driver for your own car', color: '#74f5ff' }
                ].map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${m.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: m.color }}>{m.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#00dbe7' }}>shield</span>
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.8px', marginBottom: 24 }}>Travel Securely</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 420, margin: '0 auto' }}>
                {[
                  { icon: 'verified_user', label: '🛡 Aadhaar Verification' },
                  { icon: 'explore', label: '📍 Live Tracking' },
                  { icon: 'crisis_alert', label: '🚨 SOS Alert' },
                  { icon: 'psychology', label: '🤖 AI Monitoring' },
                  { icon: 'mic', label: '🎤 Voice Booking' }
                ].map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 500, color: 'rgba(211,228,254,0.70)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#00dbe7' }}>check_circle</span>
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Buttons */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {step < 2 ? (
            <div style={{ display: 'flex', gap: 14 }}>
              <button onClick={handleSkip}
                style={{ flex: 1, padding: '14px', background: 'transparent', color: 'rgba(211,228,254,0.50)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#d3e4fe'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(211,228,254,0.50)'; e.currentTarget.style.background = 'transparent'; }}
              >Skip</button>
              
              <button onClick={handleNext}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(0,219,231,0.25)', transition: 'opacity 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >Next</button>
            </div>
          ) : (
            <button onClick={handleNext}
              style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 25px rgba(0,219,231,0.30)', transition: 'opacity 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >Get Started</button>
          )}
        </div>

      </div>
    </div>
  );
}
