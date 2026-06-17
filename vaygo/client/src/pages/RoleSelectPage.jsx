import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelectPage() {
  const [selectedParent, setSelectedParent] = useState('PASSENGER'); // PASSENGER or DRIVER
  const [selectedDriverModel, setSelectedDriverModel] = useState('DRIVER_PLANNED'); // DRIVER_PLANNED, DRIVER_HIRE, DRIVER_ON_DEMAND
  const navigate = useNavigate();

  const handleContinue = () => {
    const finalRole = (selectedParent === 'PASSENGER' ? 'passenger' : selectedDriverModel).toLowerCase();
    sessionStorage.setItem('vaygo_role', finalRole);
    navigate('/register');
  };

  const css = `
    @keyframes glowPulse { 0%,100%{opacity:.22;transform:scale(1)} 50%{opacity:.50;transform:scale(1.07)} }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); max-height: 0; }
      to { opacity: 1; transform: translateY(0); max-height: 500px; }
    }
    .slide-down-container {
      animation: slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>{css}</style>

      {/* Atmospheric Glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(0,219,231,0.04)', filter: 'blur(90px)', animation: 'glowPulse 6s ease-in-out infinite' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 500, padding: 24 }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.8px', marginBottom: 8 }}>
            How would you like to use Vaygo?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(211,228,254,0.45)' }}>
            Select your primary mode to continue registration.
          </p>
        </div>

        {/* Primary Role Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          
          {/* Passenger Card */}
          <div
            onClick={() => setSelectedParent('PASSENGER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '20px 24px',
              borderRadius: 18,
              background: selectedParent === 'PASSENGER' ? 'rgba(0,219,231,0.06)' : 'rgba(255,255,255,0.02)',
              border: selectedParent === 'PASSENGER' ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: selectedParent === 'PASSENGER' ? '0 10px 30px rgba(0,219,231,0.12)' : 'none',
            }}
            onMouseEnter={e => {
              if (selectedParent !== 'PASSENGER') {
                e.currentTarget.style.borderColor = 'rgba(0,219,231,0.30)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }
            }}
            onMouseLeave={e => {
              if (selectedParent !== 'PASSENGER') {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: selectedParent === 'PASSENGER' ? 'rgba(0,219,231,0.15)' : 'rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedParent === 'PASSENGER' ? '#00dbe7' : 'rgba(211,228,254,0.40)',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26 }}>hail</span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe' }}>Find a Ride</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: selectedParent === 'PASSENGER' ? '#00dbe7' : 'rgba(211,228,254,0.35)' }}>
                  (Passenger)
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginTop: 4, lineHeight: 1.5 }}>
                Book planned trips, hire cars, or request drivers on-demand.
              </p>
            </div>

            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: selectedParent === 'PASSENGER' ? '6px solid #00dbe7' : '2px solid rgba(211,228,254,0.20)',
              background: selectedParent === 'PASSENGER' ? '#002022' : 'transparent',
              transition: 'all 0.2s',
              flexShrink: 0
            }} />
          </div>

          {/* Driver Card */}
          <div
            onClick={() => setSelectedParent('DRIVER')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 24px',
              borderRadius: 18,
              background: selectedParent === 'DRIVER' ? 'rgba(0,219,231,0.04)' : 'rgba(255,255,255,0.02)',
              border: selectedParent === 'DRIVER' ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: selectedParent === 'DRIVER' ? '0 10px 30px rgba(0,219,231,0.08)' : 'none',
            }}
            onMouseEnter={e => {
              if (selectedParent !== 'DRIVER') {
                e.currentTarget.style.borderColor = 'rgba(0,219,231,0.30)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }
            }}
            onMouseLeave={e => {
              if (selectedParent !== 'DRIVER') {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: selectedParent === 'DRIVER' ? 'rgba(0,219,231,0.15)' : 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selectedParent === 'DRIVER' ? '#00dbe7' : 'rgba(211,228,254,0.40)',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 26 }}>directions_car</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe' }}>Offer Services</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: selectedParent === 'DRIVER' ? '#00dbe7' : 'rgba(211,228,254,0.35)' }}>
                    (Driver / Partner)
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginTop: 4, lineHeight: 1.5 }}>
                  Offer carpool rides, list your vehicle for custom hire, or drive for others.
                </p>
              </div>

              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: selectedParent === 'DRIVER' ? '6px solid #00dbe7' : '2px solid rgba(211,228,254,0.20)',
                background: selectedParent === 'DRIVER' ? '#002022' : 'transparent',
                transition: 'all 0.2s',
                flexShrink: 0
              }} />
            </div>

            {/* Sub-selection Dropdown for 3 Driver Models */}
            {selectedParent === 'DRIVER' && (
              <div className="slide-down-container" style={{ width: '100%', marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#00dbe7', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Choose your Driver model
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { code: 'DRIVER_PLANNED', title: 'Offer Planned Trip', sub: 'Carpool', icon: 'schedule', desc: 'Share daily commute routes and split travel expenses.' },
                    { code: 'DRIVER_HIRE', title: 'Offer Flexible Hire', sub: 'Car Owner', icon: 'directions_car', desc: 'List your car along with yourself as the driver for custom trips.' },
                    { code: 'DRIVER_ON_DEMAND', title: 'Drive for Others', sub: 'Driver on Demand', icon: 'person_pin', desc: 'Offer professional driving services for other owners\' vehicles.' }
                  ].map((subModel) => {
                    const isSubSelected = selectedDriverModel === subModel.code;
                    return (
                      <div
                        key={subModel.code}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent toggling the main parent selection
                          setSelectedDriverModel(subModel.code);
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 12,
                          background: isSubSelected ? 'rgba(0,219,231,0.06)' : 'rgba(255,255,255,0.02)',
                          border: isSubSelected ? '1px solid rgba(0,219,231,0.50)' : '1px solid rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          if (!isSubSelected) e.currentTarget.style.borderColor = 'rgba(0,219,231,0.20)';
                        }}
                        onMouseLeave={e => {
                          if (!isSubSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        }}
                      >
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: isSubSelected ? 'rgba(0,219,231,0.12)' : 'rgba(255,255,255,0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSubSelected ? '#00dbe7' : 'rgba(211,228,254,0.40)',
                          flexShrink: 0
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{subModel.icon}</span>
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#d3e4fe' }}>
                            {subModel.title} <span style={{ fontSize: 11, fontWeight: 600, color: isSubSelected ? '#00dbe7' : 'rgba(211,228,254,0.35)' }}>({subModel.sub})</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>
                            {subModel.desc}
                          </div>
                        </div>
                        
                        {/* Radio indicator */}
                        <div style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          border: isSubSelected ? '4px solid #00dbe7' : '1.5px solid rgba(211,228,254,0.20)',
                          background: isSubSelected ? '#002022' : 'transparent',
                          flexShrink: 0
                        }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
