import { Routes, Route, Navigate } from 'react-router-dom';
import SplashPage      from './pages/SplashPage';
import OnboardingPage  from './pages/OnboardingPage';
import LanguagePage    from './pages/LanguagePage';
import RoleSelectPage  from './pages/RoleSelectPage';
import RegisterPage    from './pages/RegisterPage';
import LoginPage       from './pages/LoginPage';
import OtpPage         from './pages/OtpPage';
import VerificationPage from './pages/VerificationPage';

// Legacy dashboard (drivers) 
import DashboardPage   from './pages/DashboardPage';

// Passenger dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout';
import HomePage        from './pages/dashboard/HomePage';
import SearchPage      from './pages/dashboard/SearchPage';
import BookingsPage    from './pages/dashboard/BookingsPage';
import TrackingPage    from './pages/dashboard/TrackingPage';
import SafetyPage      from './pages/dashboard/SafetyPage';
import WalletPage      from './pages/dashboard/WalletPage';
import HistoryPage     from './pages/dashboard/HistoryPage';
import ProfilePage     from './pages/dashboard/ProfilePage';
import SettingsPage    from './pages/dashboard/SettingsPage';

export default function App() {
  return (
    <Routes>
      {/* ── Public / Auth ── */}
      <Route path="/"             element={<SplashPage />} />
      <Route path="/onboarding"   element={<OnboardingPage />} />
      <Route path="/language"     element={<LanguagePage />} />
      <Route path="/role-select"  element={<RoleSelectPage />} />
      <Route path="/register"     element={<RegisterPage />} />
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/otp"          element={<OtpPage />} />
      <Route path="/verification" element={<VerificationPage />} />

      {/* ── Driver dashboard (kept at separate path) ── */}
      <Route path="/driver-dashboard" element={<DashboardPage />} />

      {/* ── Passenger dashboard (nested routes) ── */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index           element={<Navigate to="/dashboard/home" replace />} />
        <Route path="home"     element={<HomePage />} />
        <Route path="search"   element={<SearchPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="safety"   element={<SafetyPage />} />
        <Route path="wallet"   element={<WalletPage />} />
        <Route path="history"  element={<HistoryPage />} />
        <Route path="profile"  element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}