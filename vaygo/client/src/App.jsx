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
import ChatPage        from './pages/dashboard/ChatPage';

// Planned Trip - Passenger
import SearchRidePage from './pages/dashboard/planned-trip/passenger/SearchRidePage';
import SearchResultsPage from './pages/dashboard/planned-trip/passenger/SearchResultsPage';
import RideDetailsPage from './pages/dashboard/planned-trip/passenger/RideDetailsPage';
import PaymentPage from './pages/dashboard/planned-trip/passenger/PaymentPage';
import BookingConfirmPage from './pages/dashboard/planned-trip/passenger/BookingConfirmPage';
import LiveTrackingPage from './pages/dashboard/planned-trip/passenger/LiveTrackingPage';
import RateDriverPage from './pages/dashboard/planned-trip/passenger/RateDriverPage';

// Planned Trip - Driver
import CreateRidePage from './pages/dashboard/planned-trip/driver/CreateRidePage';
import ManageRidesPage from './pages/dashboard/planned-trip/driver/ManageRidesPage';
import RidePassengersPage from './pages/dashboard/planned-trip/driver/RidePassengersPage';
import NavigationPage from './pages/dashboard/planned-trip/driver/NavigationPage';
import RatePassengerPage from './pages/dashboard/planned-trip/driver/RatePassengerPage';

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
      <Route path="/driver-dashboard">
        <Route index element={<DashboardPage />} />
        <Route path="create-ride" element={<CreateRidePage />} />
        <Route path="rides" element={<ManageRidesPage />} />
        <Route path="ride/:rideId/passengers" element={<RidePassengersPage />} />
        <Route path="ride/:rideId/navigate" element={<NavigationPage />} />
        <Route path="ride/:rideId/rate" element={<RatePassengerPage />} />
        <Route path="booking/:bookingId/chat" element={<ChatPage />} />
      </Route>

      {/* ── Passenger dashboard (nested routes) ── */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index           element={<Navigate to="/dashboard/home" replace />} />
        <Route path="home"     element={<HomePage />} />
        {/* Planned Trip Passenger Routes */}
        <Route path="search"   element={<SearchRidePage />} />
        <Route path="search/results" element={<SearchResultsPage />} />
        <Route path="ride/:rideId" element={<RideDetailsPage />} />
        <Route path="ride/:rideId/payment" element={<PaymentPage />} />
        <Route path="booking/:bookingId/confirm" element={<BookingConfirmPage />} />
        <Route path="booking/:bookingId/track" element={<LiveTrackingPage />} />
        <Route path="booking/:bookingId/rate" element={<RateDriverPage />} />
        <Route path="booking/:bookingId/chat" element={<ChatPage />} />
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