import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', city: '', gender: '' });

  useEffect(() => {
    const cached = localStorage.getItem('vaygo_user');
    if (cached) {
      const u = JSON.parse(cached);
      setUser(u);
      setForm({
        full_name: u.full_name || u.personal_info?.full_name || '',
        phone:     u.phone     || u.personal_info?.phone     || '',
        email:     u.email     || u.personal_info?.email     || '',
        city:      u.city      || '',
        gender:    u.gender    || u.personal_info?.gender    || '',
      });
    }
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('vaygo_token')}`
        },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          city: form.city,
          gender: form.gender
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('vaygo_user', JSON.stringify(data.user));
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      alert('Network error, please try again');
    }
  };

  const INFO_ROWS = [
    { label: 'Full Name',  value: form.full_name, icon: 'person',    field: 'full_name' },
    { label: 'Phone',      value: form.phone,     icon: 'phone',     field: 'phone', readOnly: true },
    { label: 'Email',      value: form.email,     icon: 'mail',      field: 'email' },
    { label: 'City',       value: form.city,      icon: 'location_city', field: 'city' },
    { label: 'Gender',     value: form.gender,    icon: 'wc',        field: 'gender' },
  ];

  const ec = user?.emergency_contact || user?.trusted_contacts?.[0];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>My Profile</div>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 28 }}>Your personal information and account details</div>

      {/* Avatar + Name Card */}
      <div style={{ borderRadius: 20, background: 'linear-gradient(135deg,rgba(0,219,231,0.08),rgba(0,50,80,0.06))', border: '1px solid rgba(0,219,231,0.14)', padding: '28px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.18),rgba(0,100,140,0.12))', border: '2px solid rgba(0,219,231,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 34, color: '#00dbe7' }}>person</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.3px' }}>{form.full_name || '—'}</div>
          <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.50)', marginTop: 4 }}>{form.phone}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3a0', boxShadow: '0 0 6px #22d3a0' }} />
            <span style={{ fontSize: 11, color: '#22d3a0', fontWeight: 700 }}>Active Account</span>
          </div>
        </div>
        <button onClick={() => setEditing(!editing)}
          style={{ padding: '8px 18px', background: editing ? 'rgba(255,77,77,0.08)' : 'rgba(0,219,231,0.08)', border: editing ? '1px solid rgba(255,77,77,0.20)' : '1px solid rgba(0,219,231,0.20)', borderRadius: 10, color: editing ? 'rgba(255,130,130,0.80)' : '#00dbe7', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Personal Info */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.40)', letterSpacing: '0.06em' }}>PERSONAL INFORMATION</div>
        {INFO_ROWS.map((row, i) => (
          <div key={i} style={{ padding: '13px 20px', borderBottom: i < INFO_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(0,219,231,0.60)', flexShrink: 0 }}>{row.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.35)', fontWeight: 600, marginBottom: 3 }}>{row.label.toUpperCase()}</div>
              {editing && !row.readOnly ? (
                row.field === 'gender' ? (
                  <select value={form[row.field]} onChange={e => setForm({ ...form, [row.field]: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,219,231,0.20)', borderRadius: 7, color: '#d3e4fe', fontSize: 13, padding: '6px 10px', outline: 'none', colorScheme: 'dark' }}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                ) : (
                  <input value={form[row.field]} onChange={e => setForm({ ...form, [row.field]: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,219,231,0.18)', borderRadius: 7, color: '#d3e4fe', fontSize: 13, padding: '6px 10px', outline: 'none', width: 'auto', minWidth: 180 }} />
                )
              ) : (
                <div style={{ fontSize: 13, fontWeight: 600, color: row.value ? '#d3e4fe' : 'rgba(211,228,254,0.30)' }}>{row.value || '—'}</div>
              )}
            </div>
          </div>
        ))}
        {editing && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={handleSave}
              style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.40)', letterSpacing: '0.06em' }}>EMERGENCY CONTACT</div>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,100,100,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ff8080' }}>emergency</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe' }}>{ec?.name || '—'}</div>
            <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)', marginTop: 2 }}>{ec?.phone || 'Not set'}</div>
          </div>
        </div>
      </div>

      {/* KYC Status */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.40)', marginBottom: 14, letterSpacing: '0.06em' }}>KYC STATUS</div>
        {[
          { label: 'Aadhaar Verification', done: false },
          { label: 'PAN Verification',     done: false },
          { label: 'Selfie (Face Match)',   done: false },
        ].map((k, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ fontSize: 13, color: '#d3e4fe' }}>{k.label}</div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: k.done ? 'rgba(34,211,160,0.08)' : 'rgba(255,165,0,0.08)', color: k.done ? '#22d3a0' : '#fbbf24', border: `1px solid ${k.done ? 'rgba(34,211,160,0.20)' : 'rgba(255,165,0,0.20)'}` }}>
              {k.done ? '✓ Verified' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
