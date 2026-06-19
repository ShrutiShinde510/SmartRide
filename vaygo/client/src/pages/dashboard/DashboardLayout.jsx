import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard/home',     icon: 'home',            label: 'Home'     },
  { path: '/dashboard/search',   icon: 'search',          label: 'Search'   },
  { path: '/dashboard/bookings', icon: 'calendar_month',  label: 'Bookings' },
  { path: '/dashboard/tracking', icon: 'location_on',     label: 'Track'    },
  { path: '/dashboard/safety',   icon: 'shield',          label: 'Safety'   },
  { path: '/dashboard/wallet',   icon: 'account_balance_wallet', label: 'Wallet' },
  { path: '/dashboard/history',  icon: 'history',         label: 'History'  },
  { path: '/dashboard/profile',  icon: 'person',          label: 'Profile'  },
  { path: '/dashboard/settings', icon: 'settings',        label: 'Settings' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('vaygo_token');
    if (!token) { navigate('/login'); return; }
    const cached = localStorage.getItem('vaygo_user');
    if (cached) {
      const userObj = JSON.parse(cached);
      const role = (userObj.account?.role || userObj.role || 'passenger').toLowerCase();
      if (role !== 'passenger') {
        navigate('/driver-dashboard');
        return;
      }
      setUser(userObj);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('vaygo_token');
    localStorage.removeItem('vaygo_user');
    navigate('/');
  };

  const userName = user?.full_name || user?.personal_info?.full_name || 'Passenger';
  const active = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div style={{ background: '#020e1c', color: '#d3e4fe', fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,219,231,0.20); border-radius: 4px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .page-enter { animation: fadeIn 0.25s ease both; }
        @keyframes glowPulse { 0%,100%{opacity:.15} 50%{opacity:.35} }
      `}</style>

      {/* ── Top Navbar ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(2,14,28,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'rgba(211,228,254,0.60)', cursor: 'pointer', display: 'flex', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Vaygo</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(0,219,231,0.08)', color: '#00dbe7', border: '1px solid rgba(0,219,231,0.18)' }}>Passenger</span>
            </div>
          </div>

          {/* Center: active page name */}
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(211,228,254,0.70)' }}>
            {NAV_ITEMS.find(n => active(n.path))?.label || 'Dashboard'}
          </span>

          {/* Right: user + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/dashboard/profile')}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,219,231,0.15),rgba(0,241,254,0.08))', border: '1px solid rgba(0,219,231,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#00dbe7' }}>person</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#d3e4fe' }}>{userName.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout} style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.20)', borderRadius: 8, color: 'rgba(255,130,130,0.90)', fontSize: 12, fontWeight: 700, padding: '5px 12px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Sidebar Drawer (desktop + mobile) ── */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          {/* Backdrop */}
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} />
          {/* Drawer */}
          <div style={{ position: 'relative', width: 260, height: '100%', background: '#061524', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', zIndex: 1, animation: 'fadeIn 0.2s ease' }}>
            {/* Drawer header */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>Vaygo</div>
              <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)' }}>Hi, {userName} 👋</div>
            </div>
            {/* Nav links */}
            <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
              {NAV_ITEMS.map(item => (
                <button key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: active(item.path) ? 'rgba(0,219,231,0.08)' : 'transparent', border: active(item.path) ? '1px solid rgba(0,219,231,0.18)' : '1px solid transparent', color: active(item.path) ? '#00dbe7' : 'rgba(211,228,254,0.55)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
            {/* Logout */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.15)', color: 'rgba(255,130,130,0.80)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main style={{ flex: 1 }}>
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
