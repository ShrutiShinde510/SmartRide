import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  // Load initial from localStorage
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('vaygo_settings');
    return saved ? JSON.parse(saved) : {
      language:      'en',
      theme:         'dark',
      notifications: true,
      sms_alerts:    true,
      email_updates: false,
      location_share:false,
      two_factor:    false,
    };
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const toggle = (key) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    localStorage.setItem('vaygo_settings', JSON.stringify(newPrefs));
  };

  const handleLanguageChange = (e) => {
    const newPrefs = { ...prefs, language: e.target.value };
    setPrefs(newPrefs);
    localStorage.setItem('vaygo_settings', JSON.stringify(newPrefs));
  };

  const Toggle = ({ val, onToggle }) => (
    <button onClick={onToggle}
      style={{ width: 44, height: 24, borderRadius: 12, background: val ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'rgba(255,255,255,0.10)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: val ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: val ? '#002022' : 'rgba(211,228,254,0.40)', transition: 'left 0.25s' }} />
    </button>
  );

  const SECTIONS = [
    {
      title: 'Preferences',
      items: [
        { label: 'Language', sub: 'App display language', icon: 'translate', node: (
          <select value={prefs.language} onChange={handleLanguageChange}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 7, color: '#d3e4fe', fontSize: 12, padding: '5px 8px', outline: 'none', colorScheme: 'dark' }}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        )},
        { label: 'Push Notifications', sub: 'Ride updates and offers', icon: 'notifications', toggle: 'notifications' },
        { label: 'SMS Alerts', sub: 'Booking confirmations via SMS', icon: 'sms', toggle: 'sms_alerts' },
        { label: 'Email Updates', sub: 'Newsletters and receipts', icon: 'email', toggle: 'email_updates' },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { label: 'Share Live Location', sub: 'With emergency contacts during trip', icon: 'share_location', toggle: 'location_share' },
        { label: 'Two-Factor Authentication', sub: 'Extra login security via OTP', icon: 'security', toggle: 'two_factor' },
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Change Password', sub: 'Update your login password', icon: 'lock_reset', action: () => {
            setShowPasswordModal(true);
        }},
        { label: 'Download My Data', sub: 'Export all your ride & account data', icon: 'download', action: () => {
            const userData = JSON.parse(localStorage.getItem('vaygo_user') || '{}');
            const fullData = {
              account_details: userData,
              preferences: prefs,
              export_date: new Date().toISOString()
            };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "vaygo_complete_account_data.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }},
        { label: 'Delete Account', sub: 'Permanently remove your account', icon: 'delete_forever', danger: true, action: () => {
            if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
              localStorage.removeItem('vaygo_token');
              localStorage.removeItem('vaygo_user');
              alert("Account deleted. Redirecting...");
              window.location.href = '/';
            }
        }},
      ]
    }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>Settings</div>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 28 }}>Manage your app preferences and account</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SECTIONS.map((sec, si) => (
          <div key={si} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 11, fontWeight: 700, color: 'rgba(211,228,254,0.40)', letterSpacing: '0.07em' }}>{sec.title.toUpperCase()}</div>
            {sec.items.map((item, ii) => (
              <div key={ii} style={{ padding: '14px 20px', borderBottom: ii < sec.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: 14, cursor: item.action ? 'pointer' : 'default' }}
                onClick={item.action}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: item.danger ? 'rgba(255,77,77,0.07)' : 'rgba(0,219,231,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: item.danger ? '#ff6b6b' : '#00dbe7' }}>{item.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: item.danger ? '#ff8080' : '#d3e4fe' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.35)', marginTop: 2 }}>{item.sub}</div>
                </div>
                {item.toggle && <Toggle val={prefs[item.toggle]} onToggle={() => toggle(item.toggle)} />}
                {item.node}
                {item.action && !item.toggle && !item.node && (
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(211,228,254,0.30)' }}>chevron_right</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Logout */}
      <button onClick={() => { localStorage.removeItem('vaygo_token'); localStorage.removeItem('vaygo_user'); navigate('/'); }}
        style={{ width: '100%', marginTop: 20, padding: '13px', borderRadius: 12, background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.15)', color: 'rgba(255,130,130,0.80)', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
        Logout from Vaygo
      </button>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(211,228,254,0.20)' }}>Vaygo v2.0 · © 2025 All rights reserved</div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, width: '100%', maxWidth: 400, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#d3e4fe', fontSize: 20 }}>Change Password</h3>
            <p style={{ margin: '0 0 20px 0', color: 'rgba(211,228,254,0.5)', fontSize: 13 }}>Create a new password that is at least 6 characters long.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.7)', marginBottom: 6, fontWeight: 600 }}>Current Password</label>
                <input type="password" placeholder="Enter current password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.7)', marginBottom: 6, fontWeight: 600 }}>New Password</label>
                <input type="password" placeholder="Enter new password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(211,228,254,0.7)', marginBottom: 6, fontWeight: 600 }}>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => { setShowPasswordModal(false); setPasswords({current: '', new: '', confirm: ''}); }}
                style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d3e4fe', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={async () => {
                if(!passwords.current || !passwords.new || !passwords.confirm) return alert('Please fill all fields');
                if(passwords.new !== passwords.confirm) return alert('New passwords do not match');
                
                try {
                  const res = await fetch('/api/auth/change-password', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('vaygo_token')}`
                    },
                    body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
                  });
                  const data = await res.json();
                  
                  if (data.success) {
                    alert('Password successfully updated!');
                    setShowPasswordModal(false);
                    setPasswords({current: '', new: '', confirm: ''});
                  } else {
                    alert(data.message || 'Failed to update password');
                  }
                } catch (err) {
                  alert('Network error, please try again');
                }
              }}
                style={{ flex: 1, padding: 12, borderRadius: 10, background: '#00dbe7', border: 'none', color: '#002022', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
