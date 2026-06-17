import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const handleContinue = () => {
    sessionStorage.setItem('vaygo_language', selectedLanguage);
    navigate('/role-select');
  };

  const css = `
    @keyframes glowPulse { 0%,100%{opacity:.22;transform:scale(1)} 50%{opacity:.50;transform:scale(1.07)} }
  `;

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>{css}</style>

      {/* Atmospheric Glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(0,219,231,0.05)', filter: 'blur(80px)', animation: 'glowPulse 6s ease-in-out infinite' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 450, padding: 24 }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#00dbe7' }}>language</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px', marginBottom: 8 }}>Select Language</h2>
          <p style={{ fontSize: 14, color: 'rgba(211,228,254,0.45)' }}>Choose your preferred language for Vaygo</p>
        </div>

        {/* Language Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 40 }}>
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                style={{
                  padding: '20px 16px',
                  borderRadius: 16,
                  background: isSelected ? 'rgba(0,219,231,0.06)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(0,219,231,0.12)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(0,219,231,0.30)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: isSelected ? '#00dbe7' : '#d3e4fe' }}>
                  {lang.native}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)', marginTop: 4 }}>
                  {lang.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg,#00dbe7,#00f1fe)',
            color: '#002022',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(0,219,231,0.30)',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          <span>Continue</span>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
        </button>

      </div>
    </div>
  );
}
