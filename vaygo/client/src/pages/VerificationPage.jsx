import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerificationPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('DRIVER_PLANNED');
  // DRIVER_PLANNED: 0=Documents, 1=Face Scan, 2=Vehicle, 3=Preferences, 4=Processing
  // Others:         0=Documents, 1=Face Scan, 2=Details, 3=Processing
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [files, setFiles] = useState({
    aadhaar: null,
    pan: null,
    dl: null,
    police: null,
    address_proof: null,
    insurance: null,
    rcBook: null,
    v_front: null,
    v_back: null,
    v_interior: null,
    v_boot: null
  });

  const [identityDetails, setIdentityDetails] = useState({
    aadhaar_number: '',
    pan_number: '',
    dl_number: '',
    dl_expiry: '',
    dl_classes: ['LMV'], // for DRIVER_ON_DEMAND
    police_cert_date: '',
    bg_consent: false
  });

  const [vehicleDetails, setVehicleDetails] = useState({
    vehicle_number: '',
    vehicle_type: 'sedan',
    brand: '',
    model: '',
    seating_capacity: 4,
    ac: true,
    luggage_space: 'medium', // Planned: luggage_space; Hire: luggage_capacity
    fuel_type: 'petrol'
  });

  const [availability, setAvailability] = useState({
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    time_from: '06:00',
    time_to: '22:00',
    min_booking_hrs: 4,
    service_areas: 'Mumbai, Pune',
    max_radius_km: 50,
    outstation: false
  });

  const [pricing, setPricing] = useState({
    rate_per_hour: 150,
    rate_per_km: 12,
    base_fare: 200,
    rate_per_trip: 150
  });

  const [experience, setExperience] = useState({
    years_driving: 2,
    vehicle_types: ['sedan'],
    languages: ['English', 'Hindi']
  });

  const [preferences, setPreferences] = useState({
    gender_pref: 'any',
    smoking_allowed: false,
    luggage_allowed: true
  });

  useEffect(() => {
    const userStr = localStorage.getItem('vaygo_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const userRole = (user.account?.role || user.role || 'DRIVER_PLANNED').toUpperCase();
      setRole(userRole);
    }
  }, []);

  const handleFileChange = (e, docType) => {
    setFiles(prev => ({
      ...prev,
      [docType]: e.target.files[0] ? e.target.files[0].name : prev[docType]
    }));
  };

  const handleUploadClick = (docType) => {
    setTimeout(() => {
      setFiles(prev => {
        if (!prev[docType]) {
          return { ...prev, [docType]: `mock_${docType}.pdf` };
        }
        return prev;
      });
    }, 200);
  };

  const handleIdentityChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setIdentityDetails({
      ...identityDetails,
      [e.target.name]: val
    });
  };

  const handleVehicleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setVehicleDetails({
      ...vehicleDetails,
      [e.target.name]: val
    });
  };

  const handleAvailabilityChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAvailability({
      ...availability,
      [e.target.name]: val
    });
  };

  const handlePricingChange = (e) => {
    setPricing({
      ...pricing,
      [e.target.name]: e.target.value
    });
  };

  const handleExpChange = (e) => {
    setExperience({
      ...experience,
      [e.target.name]: e.target.value
    });
  };

  const toggleAvailableDay = (day) => {
    setAvailability(prev => {
      const days = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days };
    });
  };

  const toggleLanguage = (lang) => {
    setExperience(prev => {
      const languages = prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages };
    });
  };

  const toggleVehicleTypeDriver = (vt) => {
    setExperience(prev => {
      const vehicle_types = prev.vehicle_types.includes(vt)
        ? prev.vehicle_types.filter(v => v !== vt)
        : [...prev.vehicle_types, vt];
      return { ...prev, vehicle_types };
    });
  };

  const toggleDlClass = (cls) => {
    setIdentityDetails(prev => {
      const dl_classes = prev.dl_classes.includes(cls)
        ? prev.dl_classes.filter(c => c !== cls)
        : [...prev.dl_classes, cls];
      return { ...prev, dl_classes };
    });
  };

  const handleNextStep = () => {
    if (step === 0) {
      if (!identityDetails.aadhaar_number || !identityDetails.pan_number || !identityDetails.dl_number || !identityDetails.dl_expiry) {
        setError('Please fill in all identity document numbers and expiry dates');
        return;
      }
      if (!files.aadhaar || !files.pan || !files.dl) {
        setError('Please upload all required identity documents (Aadhaar, PAN, DL)');
        return;
      }
      if (role === 'DRIVER_ON_DEMAND') {
        if (!identityDetails.police_cert_date) {
          setError('Please select Police Certificate issue date');
          return;
        }
        if (!files.police || !files.address_proof) {
          setError('Please upload Police Clearance Certificate and Address Proof');
          return;
        }
        if (!identityDetails.bg_consent) {
          setError('Please consent to the background verification audit');
          return;
        }
      }
      setError('');
      setStep(1);
    } else if (step === 1) {
      setError('');
      setStep(2);
    } else if (step === 2) {
      // Vehicle details step
      if (role === 'DRIVER_PLANNED' || role === 'DRIVER_HIRE') {
        if (!vehicleDetails.vehicle_number || !vehicleDetails.brand || !vehicleDetails.model) {
          setError('Please enter Vehicle Registration Number, Brand, and Model');
          return;
        }
        if (!files.rcBook) {
          setError('Please upload the RC Book');
          return;
        }
        if (!files.v_front || !files.v_back || !files.v_interior) {
          setError('Please upload front, back, and interior photos of the vehicle');
          return;
        }
        if (role === 'DRIVER_HIRE') {
          if (!files.v_boot) {
            setError('Please upload the boot photo of the vehicle');
            return;
          }
          if (!availability.service_areas) {
            setError('Please enter service areas for availability');
            return;
          }
        }
      } else if (role === 'DRIVER_ON_DEMAND') {
        if (!availability.service_areas) {
          setError('Please enter service areas for availability');
          return;
        }
      }
      setError('');
      // DRIVER_PLANNED has an extra Preferences step before submission
      if (role === 'DRIVER_PLANNED') {
        setStep(3);
      } else {
        handleSubmitVerification();
      }
    } else if (step === 3 && role === 'DRIVER_PLANNED') {
      // Preferences step — no required fields, submit directly
      setError('');
      handleSubmitVerification();
    }
  };

  const handleSubmitVerification = async () => {
    // DRIVER_PLANNED has 4 steps before audit (0-3), others have 3 (0-2)
    setStep(role === 'DRIVER_PLANNED' ? 4 : 3);
    setLoading(true);

    try {
      const token = localStorage.getItem('vaygo_token');
      if (!token) throw new Error('Authorization token missing. Please log in.');

      const body = {
        kyc: {
          aadhaar_number: identityDetails.aadhaar_number,
          pan_number: identityDetails.pan_number
        },
        driving_licence: {
          dl_number: identityDetails.dl_number,
          dl_expiry: identityDetails.dl_expiry
        }
      };

      if (role === 'DRIVER_PLANNED') {
        body.vehicle = {
          type: vehicleDetails.vehicle_type,
          brand: vehicleDetails.brand,
          model: vehicleDetails.model,
          registration_no: vehicleDetails.vehicle_number,
          total_seats: Number(vehicleDetails.seating_capacity),
          ac: vehicleDetails.ac,
          luggage_space: vehicleDetails.luggage_space,
          fuel_type: vehicleDetails.fuel_type
        };
        body.preferences = {
          gender_pref: preferences.gender_pref,
          smoking_allowed: preferences.smoking_allowed,
          luggage_allowed: preferences.luggage_allowed
        };
      } else if (role === 'DRIVER_HIRE') {
        body.vehicle = {
          type: vehicleDetails.vehicle_type,
          brand: vehicleDetails.brand,
          model: vehicleDetails.model,
          registration_no: vehicleDetails.vehicle_number,
          total_seats: Number(vehicleDetails.seating_capacity),
          ac: vehicleDetails.ac,
          luggage_capacity: vehicleDetails.luggage_space, // mapped
          fuel_type: vehicleDetails.fuel_type
        };
        body.availability = {
          days: availability.days,
          time_from: availability.time_from,
          time_to: availability.time_to,
          min_booking_hrs: Number(availability.min_booking_hrs),
          service_areas: availability.service_areas.split(',').map(s => s.trim()).filter(Boolean),
          max_radius_km: Number(availability.max_radius_km),
          outstation: availability.outstation
        };
        body.pricing = {
          rate_per_hour: Number(pricing.rate_per_hour),
          rate_per_km: Number(pricing.rate_per_km),
          base_fare: Number(pricing.base_fare)
        };
      } else if (role === 'DRIVER_ON_DEMAND') {
        body.driving_licence.dl_classes = identityDetails.dl_classes;
        body.background_verification = {
          police_cert_date: identityDetails.police_cert_date || new Date(),
          consent_given: identityDetails.bg_consent
        };
        body.experience = {
          years_driving: Number(experience.years_driving),
          vehicle_types: experience.vehicle_types,
          languages: experience.languages
        };
        body.availability = {
          days: availability.days,
          time_from: availability.time_from,
          time_to: availability.time_to,
          service_areas: availability.service_areas.split(',').map(s => s.trim()).filter(Boolean),
          outstation: availability.outstation
        };
        body.pricing = {
          rate_per_hour: Number(pricing.rate_per_hour),
          rate_per_trip: Number(pricing.rate_per_trip)
        };
      }

      const res = await fetch('/api/auth/verify-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification submission failed');

      // Update user in local storage
      localStorage.setItem('vaygo_user', JSON.stringify(data.user));

      // Simulate document analysis and face matching pipeline
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 3000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
      // Return to last editable step on failure
      setStep(role === 'DRIVER_PLANNED' ? 3 : 2);
    }
  };

  const css = `
    @keyframes glowPulse { 0%,100%{opacity:.22;transform:scale(1)} 50%{opacity:.50;transform:scale(1.07)} }
    @keyframes faceGridScan { 
      0% { top: 0%; opacity: 0.8; }
      50% { top: 100%; opacity: 0.8; }
      100% { top: 0%; opacity: 0.8; }
    }
    .scan-line {
      position: absolute;
      left: 0;
      width: 100%;
      height: 4px;
      background: #00dbe7;
      box-shadow: 0 0 12px #00dbe7;
      animation: faceGridScan 2s linear infinite;
    }
  `;

  return (
    <div style={{ background: '#031427', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowX: 'hidden', position: 'relative' }}>
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>{css}</style>

      {/* Atmospheric Glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(0,219,231,0.04)', filter: 'blur(100px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 540 }}>
        <div style={{ background: 'rgba(11,28,48,0.80)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.40)' }}>
          
          {/* Progress Indicator — 4 steps for DRIVER_PLANNED, 3 for others */}
          {(role === 'DRIVER_PLANNED' ? step < 4 : step < 3) && (() => {
            const steps = role === 'DRIVER_PLANNED'
              ? ['Documents', 'Face Scan', 'Vehicle', 'Preferences']
              : ['Documents', 'Face Scan', role === 'DRIVER_HIRE' ? 'Vehicle & Rates' : 'Professional'];
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                {steps.map((title, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', margin: '0 auto',
                      background: step === idx ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : step > idx ? '#00dbe7' : 'rgba(255,255,255,0.05)',
                      color: step >= idx ? '#002022' : 'rgba(211,228,254,0.40)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, zIndex: 2
                    }}>{step > idx ? <span className="material-symbols-outlined" style={{ fontSize: 16, fontWeight: 800 }}>check</span> : idx + 1}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: step === idx ? '#00dbe7' : 'rgba(211,228,254,0.30)', marginTop: 8, textAlign: 'center', display: 'block' }}>{title}</span>
                    {idx < steps.length - 1 && (
                      <div style={{ position: 'absolute', top: 14, left: '50%', right: '-50%', height: 2, background: step > idx ? '#00dbe7' : 'rgba(255,255,255,0.06)', zIndex: 1 }} />
                    )}
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Step 0: Document Uploads & Identity Numbers */}
          {step === 0 && (
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#d3e4fe', marginBottom: 8, letterSpacing: '-0.3px' }}>Identity Documents & KYC Info</h3>
              <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 24 }}>Enter your ID document numbers and upload files for verification.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* 1. Aadhaar Card */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>1. Aadhaar Card</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>AADHAAR NUMBER</label>
                      <input name="aadhaar_number" type="text" placeholder="12-digit Aadhaar Number" value={identityDetails.aadhaar_number} onChange={handleIdentityChange} required
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                    </div>
                    <label 
                      onClick={() => handleUploadClick('aadhaar')}
                      style={{ padding: '10px 14px', background: files.aadhaar ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files.aadhaar ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: files.aadhaar ? '#00dbe7' : '#d3e4fe', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{files.aadhaar ? 'check_circle' : 'upload'}</span>
                      {files.aadhaar ? 'Aadhaar Attached' : 'Upload File'}
                    </label>
                  </div>
                </div>

                {/* 2. PAN Card */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>2. PAN Card</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>PAN NUMBER</label>
                      <input name="pan_number" type="text" placeholder="10-digit Alphanumeric PAN" value={identityDetails.pan_number} onChange={handleIdentityChange} required
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                    </div>
                    <label 
                      onClick={() => handleUploadClick('pan')}
                      style={{ padding: '10px 14px', background: files.pan ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files.pan ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: files.pan ? '#00dbe7' : '#d3e4fe', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{files.pan ? 'check_circle' : 'upload'}</span>
                      {files.pan ? 'PAN Attached' : 'Upload File'}
                    </label>
                  </div>
                </div>

                {/* 3. Driving License */}
                <div style={{ borderBottom: role === 'DRIVER_ON_DEMAND' ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>3. Driving License</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>DL NUMBER</label>
                      <input name="dl_number" type="text" placeholder="DL-1420110012345" value={identityDetails.dl_number} onChange={handleIdentityChange} required
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>EXPIRY DATE</label>
                      <input name="dl_expiry" type="date" value={identityDetails.dl_expiry} onChange={handleIdentityChange} required
                        style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {role === 'DRIVER_ON_DEMAND' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['LMV', 'transport'].map(cls => {
                          const hasClass = identityDetails.dl_classes.includes(cls);
                          return (
                            <button key={cls} type="button" onClick={() => toggleDlClass(cls)}
                              style={{
                                padding: '5px 10px', borderRadius: 6,
                                background: hasClass ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)',
                                border: hasClass ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)',
                                color: hasClass ? '#00dbe7' : 'rgba(211,228,254,0.50)',
                                fontSize: 11, fontWeight: 600, cursor: 'pointer'
                              }}>
                              {cls === 'LMV' ? 'Light Motor Vehicle (LMV)' : 'Transport (Commercial)'}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <label 
                      onClick={() => handleUploadClick('dl')}
                      style={{ padding: '10px 14px', background: files.dl ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files.dl ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: files.dl ? '#00dbe7' : '#d3e4fe', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{files.dl ? 'check_circle' : 'upload'}</span>
                      {files.dl ? 'DL Attached' : 'Upload DL File'}
                    </label>
                  </div>
                </div>

                {/* 4. On-Demand Background Clearance details */}
                {role === 'DRIVER_ON_DEMAND' && (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#00dbe7', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shield_person</span>
                      Police & Background Verification
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>POLICE CERTIFICATE DATE</label>
                        <input name="police_cert_date" type="date" value={identityDetails.police_cert_date} onChange={handleIdentityChange} required
                          style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'end' }}>
                        <label 
                          onClick={() => handleUploadClick('police')}
                          style={{ padding: '9px 12px', background: files.police ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files.police ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 11, fontWeight: 600, color: files.police ? '#00dbe7' : '#d3e4fe', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{files.police ? 'check_circle' : 'upload'}</span>
                          {files.police ? 'Police Clearance' : 'Upload Clearance'}
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(211,228,254,0.45)' }}>Permanent Address Proof</span>
                        <label 
                          onClick={() => handleUploadClick('address_proof')}
                          style={{ padding: '7px 12px', background: files.address_proof ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files.address_proof ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 6, fontSize: 11, fontWeight: 600, color: files.address_proof ? '#00dbe7' : '#d3e4fe', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{files.address_proof ? 'check_circle' : 'upload'}</span>
                          {files.address_proof ? 'Attached Address' : 'Upload Proof'}
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 8 }}>
                      <input name="bg_consent" type="checkbox" checked={identityDetails.bg_consent} onChange={handleIdentityChange} required id="consent-check"
                        style={{ marginTop: 2, accentColor: '#00dbe7' }} />
                      <label htmlFor="consent-check" style={{ fontSize: 11, color: 'rgba(211,228,254,0.50)', lineHeight: 1.4, cursor: 'pointer' }}>
                        I authorize Vaygo to conduct third-party digital audits of my police check records and residential address proof documents.
                      </label>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Step 1: Face Scan */}
          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#d3e4fe', marginBottom: 8 }}>Face Verification</h3>
              <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 28 }}>Look into the camera simulator to complete matching.</p>
              
              <div style={{ width: 190, height: 190, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(0,219,231,0.35)', position: 'relative', margin: '0 auto 28px', background: 'rgba(0,219,231,0.03)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 72, color: 'rgba(0,219,231,0.22)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>photo_camera</span>
                
                {/* Simulated Camera Scan Box */}
                <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: '1px dashed #00dbe7', opacity: 0.6 }} />
                <div className="scan-line" />
                
                {/* Simulated profile face grid */}
                <div style={{ position: 'absolute', inset: 40, border: '1px solid rgba(0,219,231,0.12)', borderRadius: '50%', background: 'radial-gradient(rgba(0,219,231,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(0,219,231,0.08)', border: '1px solid rgba(0,219,231,0.20)', color: '#00dbe7', fontSize: 12, fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>videocam</span>
                <span>Active Camera Feed Simulator</span>
              </div>
            </div>
          )}

          {/* Step 2: Details Formulation (Planned Driver, Flexible Driver, and On Demand Driver) */}
          {step === 2 && (
            <div>
              {/* PLANNED DRIVER DETAILS */}
              {role === 'DRIVER_PLANNED' && (
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: '#d3e4fe', marginBottom: 6 }}>Vehicle Details (Planned Carpool)</h3>
                  <p style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', marginBottom: 20 }}>Configure your car specs to share Commute Pools.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>REGISTRATION NO.</label>
                        <input name="vehicle_number" type="text" placeholder="MH 12 AB 1234" value={vehicleDetails.vehicle_number} onChange={handleVehicleChange} required
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>BRAND</label>
                        <input name="brand" type="text" placeholder="Maruti Suzuki" value={vehicleDetails.brand} onChange={handleVehicleChange} required
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>MODEL</label>
                        <input name="model" type="text" placeholder="Swift Dzire" value={vehicleDetails.model} onChange={handleVehicleChange} required
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>VEHICLE TYPE</label>
                        <select name="vehicle_type" value={vehicleDetails.vehicle_type} onChange={handleVehicleChange}
                          style={{ width: '100%', padding: '10px 12px', background: '#0b1c30', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }}>
                          <option value="hatchback">Hatchback</option>
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="muv">MUV</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>SEATING CAPACITY</label>
                        <input name="seating_capacity" type="number" min="1" max="8" value={vehicleDetails.seating_capacity} onChange={handleVehicleChange} required
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>FUEL TYPE</label>
                        <select name="fuel_type" value={vehicleDetails.fuel_type} onChange={handleVehicleChange}
                          style={{ width: '100%', padding: '10px 12px', background: '#0b1c30', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }}>
                          <option value="petrol">Petrol</option>
                          <option value="diesel">Diesel</option>
                          <option value="cng">CNG</option>
                          <option value="ev">Electric (EV)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>LUGGAGE SPACE</label>
                        <select name="luggage_space" value={vehicleDetails.luggage_space} onChange={handleVehicleChange}
                          style={{ width: '100%', padding: '10px 12px', background: '#0b1c30', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 13, outline: 'none' }}>
                          <option value="small">Small (1 Bag)</option>
                          <option value="medium">Medium (2 Bags)</option>
                          <option value="large">Large (3+ Bags)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 6 }}>AIR CONDITIONING (AC)</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {[true, false].map(acVal => (
                            <button key={acVal.toString()} type="button" onClick={() => setVehicleDetails({ ...vehicleDetails, ac: acVal })}
                              style={{
                                flex: 1, padding: '8px', borderRadius: 8,
                                background: vehicleDetails.ac === acVal ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)',
                                border: vehicleDetails.ac === acVal ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)',
                                color: vehicleDetails.ac === acVal ? '#00dbe7' : 'rgba(211,228,254,0.50)',
                                fontSize: 12, fontWeight: 600, cursor: 'pointer'
                              }}>
                              {acVal ? 'Yes (AC)' : 'No (Non-AC)'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Document Uploads for RC & Insurance */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                      <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.10)', textAlign: 'center' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#d3e4fe', marginBottom: 6 }}>Vehicle Insurance</div>
                        <label 
                          onClick={() => handleUploadClick('insurance')}
                          style={{ display: 'inline-block', padding: '5px 10px', background: files.insurance ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files.insurance ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 6, fontSize: 11, fontWeight: 600, color: files.insurance ? '#00dbe7' : '#d3e4fe', cursor: 'pointer' }}
                        >
                          {files.insurance ? 'Attached' : 'Upload File'}
                        </label>
                      </div>
                      <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.10)', textAlign: 'center' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#d3e4fe', marginBottom: 6 }}>Registration Book (RC)</div>
                        <label 
                          onClick={() => handleUploadClick('rcBook')}
                          style={{ display: 'inline-block', padding: '5px 10px', background: files.rcBook ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files.rcBook ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 6, fontSize: 11, fontWeight: 600, color: files.rcBook ? '#00dbe7' : '#d3e4fe', cursor: 'pointer' }}
                        >
                          {files.rcBook ? 'Attached' : 'Upload File'}
                        </label>
                      </div>
                    </div>

                    {/* Vehicle Photos */}
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 6 }}>VEHICLE EXTERIOR & INTERIOR PHOTOS</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        {['v_front', 'v_back', 'v_interior'].map(pt => (
                          <div key={pt} style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.08)', textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', marginBottom: 6 }}>
                              {pt === 'v_front' ? 'Front Side' : pt === 'v_back' ? 'Back Side' : 'Interior'}
                            </div>
                            <label onClick={() => handleUploadClick(pt)}
                              style={{ display: 'inline-block', padding: '4px 8px', background: files[pt] ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files[pt] ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 6, fontSize: 10, fontWeight: 600, color: files[pt] ? '#00dbe7' : '#d3e4fe', cursor: 'pointer' }}>
                              {files[pt] ? 'Done' : 'Upload'}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* FLEXIBLE HIRE DRIVER DETAILS */}
              {role === 'DRIVER_HIRE' && (
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: '#d3e4fe', marginBottom: 6 }}>Vehicle & Rate Details (Flexible Hire)</h3>
                  <p style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', marginBottom: 16 }}>Configure vehicle parameters and booking rates.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    
                    {/* Vehicle Basic Info */}
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>Car Specifications</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>REGISTRATION NO.</label>
                          <input name="vehicle_number" type="text" placeholder="MH 12 AB 1234" value={vehicleDetails.vehicle_number} onChange={handleVehicleChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>BRAND</label>
                          <input name="brand" type="text" placeholder="Honda" value={vehicleDetails.brand} onChange={handleVehicleChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>MODEL</label>
                          <input name="model" type="text" placeholder="City" value={vehicleDetails.model} onChange={handleVehicleChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>VEHICLE TYPE</label>
                          <select name="vehicle_type" value={vehicleDetails.vehicle_type} onChange={handleVehicleChange}
                            style={{ width: '100%', padding: '8px 10px', background: '#0b1c30', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }}>
                            <option value="hatchback">Hatchback</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="muv">MUV</option>
                            <option value="van">Van</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>SEATING CAPACITY</label>
                          <input name="seating_capacity" type="number" min="1" max="8" value={vehicleDetails.seating_capacity} onChange={handleVehicleChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>FUEL TYPE</label>
                          <select name="fuel_type" value={vehicleDetails.fuel_type} onChange={handleVehicleChange}
                            style={{ width: '100%', padding: '8px 10px', background: '#0b1c30', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }}>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="cng">CNG</option>
                            <option value="ev">Electric (EV)</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>LUGGAGE CAPACITY</label>
                          <select name="luggage_space" value={vehicleDetails.luggage_space} onChange={handleVehicleChange}
                            style={{ width: '100%', padding: '8px 10px', background: '#0b1c30', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }}>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>AC STATUS</label>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {[true, false].map(acVal => (
                              <button key={acVal.toString()} type="button" onClick={() => setVehicleDetails({ ...vehicleDetails, ac: acVal })}
                                style={{
                                  flex: 1, padding: '6px', borderRadius: 6,
                                  background: vehicleDetails.ac === acVal ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)',
                                  border: vehicleDetails.ac === acVal ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)',
                                  color: vehicleDetails.ac === acVal ? '#00dbe7' : 'rgba(211,228,254,0.50)',
                                  fontSize: 11, fontWeight: 600, cursor: 'pointer'
                                }}>
                                {acVal ? 'AC' : 'Non-AC'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Vehicle Photos for Flexible Hire (Front, Back, Interior, Boot) */}
                      <div style={{ marginTop: 12 }}>
                        <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 6 }}>VEHICLE IMAGES (FRONT, BACK, INTERIOR, BOOT IS MANDATORY)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                          {['v_front', 'v_back', 'v_interior', 'v_boot'].map(pt => (
                            <div key={pt} style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.08)', textAlign: 'center' }}>
                              <div style={{ fontSize: 9, color: 'rgba(211,228,254,0.40)', marginBottom: 4 }}>
                                {pt === 'v_front' ? 'Front' : pt === 'v_back' ? 'Back' : pt === 'v_interior' ? 'Interior' : 'Boot'}
                              </div>
                              <label onClick={() => handleUploadClick(pt)}
                                style={{ display: 'inline-block', padding: '3px 6px', background: files[pt] ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.04)', border: files[pt] ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.10)', borderRadius: 4, fontSize: 9, color: files[pt] ? '#00dbe7' : '#d3e4fe', cursor: 'pointer' }}>
                                {files[pt] ? 'Yes' : 'Upload'}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Documents Insurance & RC Book */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 8 }}>
                          <span style={{ fontSize: 11, color: 'rgba(211,228,254,0.45)' }}>Insurance</span>
                          <label onClick={() => handleUploadClick('insurance')} style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 10, cursor: 'pointer', color: files.insurance ? '#00dbe7' : '#d3e4fe' }}>{files.insurance ? 'OK' : 'Upload'}</label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 8 }}>
                          <span style={{ fontSize: 11, color: 'rgba(211,228,254,0.45)' }}>RC Book</span>
                          <label onClick={() => handleUploadClick('rcBook')} style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 10, cursor: 'pointer', color: files.rcBook ? '#00dbe7' : '#d3e4fe' }}>{files.rcBook ? 'OK' : 'Upload'}</label>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Config */}
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>Configure Booking Pricing</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>HOURLY RATE (₹)</label>
                          <input name="rate_per_hour" type="number" value={pricing.rate_per_hour} onChange={handlePricingChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>PER KM RATE (₹)</label>
                          <input name="rate_per_km" type="number" value={pricing.rate_per_km} onChange={handlePricingChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>BASE FARE (₹)</label>
                          <input name="base_fare" type="number" value={pricing.base_fare} onChange={handlePricingChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                      </div>
                    </div>

                    {/* Availability Config */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>Service Areas & Availability</div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>SERVICE CITIES</label>
                          <input name="service_areas" type="text" placeholder="Mumbai, Pune" value={availability.service_areas} onChange={handleAvailabilityChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>MAX RADIUS (KM)</label>
                          <input name="max_radius_km" type="number" value={availability.max_radius_km} onChange={handleAvailabilityChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>MIN BOOKING HRS</label>
                          <input name="min_booking_hrs" type="number" min="1" value={availability.min_booking_hrs} onChange={handleAvailabilityChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>FROM HOUR</label>
                          <input name="time_from" type="text" placeholder="06:00" value={availability.time_from} onChange={handleAvailabilityChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>TO HOUR</label>
                          <input name="time_to" type="text" placeholder="22:00" value={availability.time_to} onChange={handleAvailabilityChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(211,228,254,0.45)' }}>Outstation Trips Allowed</span>
                        <input name="outstation" type="checkbox" checked={availability.outstation} onChange={handleAvailabilityChange} style={{ accentColor: '#00dbe7' }} />
                      </div>

                      <div>
                        <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 6 }}>AVAILABLE DAYS</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                            const isSel = availability.days.includes(day);
                            return (
                              <button key={day} type="button" onClick={() => toggleAvailableDay(day)}
                                style={{ padding: '5px 10px', borderRadius: 6, background: isSel ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)', border: isSel ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', color: isSel ? '#00dbe7' : 'rgba(211,228,254,0.40)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
                                {day.toUpperCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* ON DEMAND DRIVER DETAILS */}
              {role === 'DRIVER_ON_DEMAND' && (
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: '#d3e4fe', marginBottom: 6 }}>Professional Details (On-Demand Driver)</h3>
                  <p style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', marginBottom: 16 }}>Specify your driving experience and rate structure.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    
                    {/* Experience Info */}
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>Driving Record</div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>EXPERIENCE (YEARS)</label>
                          <input name="years_driving" type="number" min="0" value={experience.years_driving} onChange={handleExpChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>PREFERRED CITIES</label>
                          <input name="service_areas" type="text" placeholder="Mumbai, Pune" value={availability.service_areas} onChange={handleAvailabilityChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 6 }}>VEHICLES YOU CAN DRIVE</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {['hatchback', 'sedan', 'suv', 'muv'].map(vt => {
                            const canDrive = experience.vehicle_types.includes(vt);
                            return (
                              <button key={vt} type="button" onClick={() => toggleVehicleTypeDriver(vt)}
                                style={{ padding: '6px 12px', borderRadius: 6, background: canDrive ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)', border: canDrive ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', color: canDrive ? '#00dbe7' : 'rgba(211,228,254,0.40)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                                {vt.toUpperCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 6 }}>LANGUAGES SPOKEN</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {['English', 'Hindi', 'Marathi', 'Kannada'].map(lang => {
                            const speaks = experience.languages.includes(lang);
                            return (
                              <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                                style={{ padding: '6px 12px', borderRadius: 6, background: speaks ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)', border: speaks ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', color: speaks ? '#00dbe7' : 'rgba(211,228,254,0.40)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                                {lang}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Pricing Config */}
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>Configure Gig Pricing</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>HOURLY RATE (₹)</label>
                          <input name="rate_per_hour" type="number" value={pricing.rate_per_hour} onChange={handlePricingChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>RATE PER TRIP (₹)</label>
                          <input name="rate_per_trip" type="number" value={pricing.rate_per_trip} onChange={handlePricingChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                      </div>
                    </div>

                    {/* Availability Config */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 10 }}>Gig Work Hours</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>DAILY FROM</label>
                          <input name="time_from" type="text" placeholder="06:00" value={availability.time_from} onChange={handleAvailabilityChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 4 }}>DAILY TO</label>
                          <input name="time_to" type="text" placeholder="22:00" value={availability.time_to} onChange={handleAvailabilityChange} required
                            style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#d3e4fe', fontSize: 12, outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(211,228,254,0.45)' }}>Outstation Work Allowed</span>
                        <input name="outstation" type="checkbox" checked={availability.outstation} onChange={handleAvailabilityChange} style={{ accentColor: '#00dbe7' }} />
                      </div>

                      <div>
                        <label style={{ fontSize: 9, fontWeight: 700, color: 'rgba(211,228,254,0.40)', display: 'block', marginBottom: 6 }}>AVAILABLE DAYS</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                            const isSel = availability.days.includes(day);
                            return (
                              <button key={day} type="button" onClick={() => toggleAvailableDay(day)}
                                style={{ padding: '5px 10px', borderRadius: 6, background: isSel ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)', border: isSel ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', color: isSel ? '#00dbe7' : 'rgba(211,228,254,0.40)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
                                {day.toUpperCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Carpool Preferences (DRIVER_PLANNED only) */}
          {step === 3 && role === 'DRIVER_PLANNED' && (
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#d3e4fe', marginBottom: 6, letterSpacing: '-0.3px' }}>Carpool Preferences</h3>
              <p style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 24 }}>Set your passenger preferences for shared rides.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Gender Preference */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>group</span>
                    Passenger Gender Preference
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[{ val: 'any', label: 'Any Gender', icon: 'people' }, { val: 'female_only', label: 'Female Only', icon: 'woman' }, { val: 'male_only', label: 'Male Only', icon: 'man' }].map(opt => (
                      <button key={opt.val} type="button"
                        onClick={() => setPreferences(p => ({ ...p, gender_pref: opt.val }))}
                        style={{
                          flex: 1, padding: '12px 8px', borderRadius: 10,
                          background: preferences.gender_pref === opt.val ? 'rgba(0,219,231,0.08)' : 'rgba(255,255,255,0.02)',
                          border: preferences.gender_pref === opt.val ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)',
                          color: preferences.gender_pref === opt.val ? '#00dbe7' : 'rgba(211,228,254,0.50)',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                        }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smoking & Luggage Toggles */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#00dbe7', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>tune</span>
                    In-Car Rules
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Smoking */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 22, color: preferences.smoking_allowed ? '#00dbe7' : 'rgba(211,228,254,0.30)' }}>smoking_rooms</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#d3e4fe' }}>Smoking Allowed</div>
                          <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>Permit passengers to smoke in vehicle</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(opt => (
                          <button key={opt.label} type="button"
                            onClick={() => setPreferences(p => ({ ...p, smoking_allowed: opt.val }))}
                            style={{ padding: '6px 14px', borderRadius: 8, background: preferences.smoking_allowed === opt.val ? 'rgba(0,219,231,0.10)' : 'rgba(255,255,255,0.03)', border: preferences.smoking_allowed === opt.val ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', color: preferences.smoking_allowed === opt.val ? '#00dbe7' : 'rgba(211,228,254,0.50)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Luggage */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 22, color: preferences.luggage_allowed ? '#00dbe7' : 'rgba(211,228,254,0.30)' }}>luggage</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#d3e4fe' }}>Luggage Allowed</div>
                          <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>Allow passengers to carry bags / suitcases</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(opt => (
                          <button key={opt.label} type="button"
                            onClick={() => setPreferences(p => ({ ...p, luggage_allowed: opt.val }))}
                            style={{ padding: '6px 14px', borderRadius: 8, background: preferences.luggage_allowed === opt.val ? 'rgba(0,219,231,0.10)' : 'rgba(255,255,255,0.03)', border: preferences.luggage_allowed === opt.val ? '1px solid #00dbe7' : '1px solid rgba(255,255,255,0.08)', color: preferences.luggage_allowed === opt.val ? '#00dbe7' : 'rgba(211,228,254,0.50)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Summary preview */}
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(0,219,231,0.04)', border: '1px solid rgba(0,219,231,0.12)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.60)' }}>Gender: <strong style={{ color: '#00dbe7' }}>{preferences.gender_pref === 'any' ? 'Any' : preferences.gender_pref === 'female_only' ? 'Female Only' : 'Male Only'}</strong></div>
                  <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.60)' }}>Smoking: <strong style={{ color: preferences.smoking_allowed ? '#00dbe7' : '#ff8080' }}>{preferences.smoking_allowed ? 'Allowed' : 'Not Allowed'}</strong></div>
                  <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.60)' }}>Luggage: <strong style={{ color: preferences.luggage_allowed ? '#00dbe7' : '#ff8080' }}>{preferences.luggage_allowed ? 'Allowed' : 'Not Allowed'}</strong></div>
                </div>

              </div>
            </div>
          )}

          {/* Audit Loader: step 4 for DRIVER_PLANNED, step 3 for others */}
          {((role === 'DRIVER_PLANNED' && step === 4) || (role !== 'DRIVER_PLANNED' && step === 3)) && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 28px' }}>
                {/* Spinner */}
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid rgba(0,219,231,0.1)', borderTop: '4px solid #00dbe7', animation: 'spin 1s linear infinite' }} />
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#00dbe7', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>analytics</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 12 }}>Document Audit in Progress</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, margin: '0 auto' }}>
                {[
                  '1. Analyzing Aadhaar & PAN verification details...',
                  '2. Verifying driving license with RTO databases...',
                  '3. Performing biometric face matching audits...',
                  role === 'DRIVER_ON_DEMAND' 
                    ? '4. Running automated police records checks...' 
                    : '4. Checking registration book and insurance details...'
                ].map((log, lIdx) => (
                  <div key={lIdx} style={{ fontSize: 12, color: 'rgba(211,228,254,0.45)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#00dbe7', animation: 'spin 2s linear infinite' }}>progress_activity</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,77,77,0.10)', border: '1px solid rgba(255,77,77,0.22)', color: '#ff8080', fontSize: 13, marginTop: 20 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
              {error}
            </div>
          )}

          {/* Action Footer */}
          {(role === 'DRIVER_PLANNED' ? step < 4 : step < 3) && (
            <div style={{ marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', gap: 14 }}>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)}
                  style={{ flex: 0.5, padding: '12px', background: 'transparent', color: 'rgba(211,228,254,0.50)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  Back
                </button>
              )}
              <button onClick={handleNextStep}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 16px rgba(0,219,231,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span>
                  {role === 'DRIVER_PLANNED' && step === 3 ? 'Submit Verification' :
                   role !== 'DRIVER_PLANNED' && step === 2 ? 'Submit Verification' :
                   'Continue'}
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
