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

// Flexible Hire - Family
import PostHireRequestPage from './pages/dashboard/flexible-hire/family/PostHireRequestPage';
import BrowseCarsPage from './pages/dashboard/flexible-hire/family/BrowseCarsPage';
import OwnerProfilePage from './pages/dashboard/flexible-hire/family/OwnerProfilePage';
import PassengerOffersPage from './pages/dashboard/flexible-hire/family/PassengerOffersPage';
import NegotiateChat from './pages/dashboard/flexible-hire/family/NegotiateChat';
import HirePaymentPage from './pages/dashboard/flexible-hire/family/HirePaymentPage';
import HireConfirmPage from './pages/dashboard/flexible-hire/family/HireConfirmPage';
import HireTrackingPage from './pages/dashboard/flexible-hire/family/HireTrackingPage';
import FinalPaymentPage from './pages/dashboard/flexible-hire/family/FinalPaymentPage';
import RateOwnerPage from './pages/dashboard/flexible-hire/family/RateOwnerPage';

// Flexible Hire - Owner
import ListMyCarPage from './pages/dashboard/flexible-hire/owner/ListMyCarPage';
import OwnerDashboard from './pages/dashboard/flexible-hire/owner/OwnerDashboard';
import ManageRequestsPage from './pages/dashboard/flexible-hire/owner/ManageRequestsPage';
import ActiveHirePage from './pages/dashboard/flexible-hire/owner/ActiveHirePage';
import RateFamilyPage from './pages/dashboard/flexible-hire/owner/RateFamilyPage';

// Driver on Demand (Model 3) - Family
import M3PostRequestPage from './pages/dashboard/driver-on-demand/family/PostRequestPage';
import M3BrowseDriversPage from './pages/dashboard/driver-on-demand/family/BrowseDriversPage';
import M3PassengerOffersPage from './pages/dashboard/driver-on-demand/family/M3PassengerOffersPage';
import M3DriverProfilePage from './pages/dashboard/driver-on-demand/family/DriverProfilePage';
import M3ConfirmBookingPage from './pages/dashboard/driver-on-demand/family/ConfirmBookingPage';
import M3LiveTrackingPage from './pages/dashboard/driver-on-demand/family/LiveTrackingPage';
import M3VehicleReturnPage from './pages/dashboard/driver-on-demand/family/VehicleReturnPage';
import M3FinalPaymentPage from './pages/dashboard/driver-on-demand/family/FinalPaymentPage';
import M3RateDriverPage from './pages/dashboard/driver-on-demand/family/RateDriverPage';

// Driver on Demand (Model 3) - Driver
import M3HireSetupPage from './pages/dashboard/driver-on-demand/driver/HireSetupPage';
import M3HireDashboard from './pages/dashboard/driver-on-demand/driver/HireDashboard';
import M3NavigateToPickupPage from './pages/dashboard/driver-on-demand/driver/NavigateToPickupPage';
import M3PreInspectionPage from './pages/dashboard/driver-on-demand/driver/PreInspectionPage';
import M3ActiveTripPage from './pages/dashboard/driver-on-demand/driver/ActiveTripPage';
import M3PostInspectionPage from './pages/dashboard/driver-on-demand/driver/PostInspectionPage';

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

        {/* Flexible Hire Owner Routes */}
        <Route path="owner/list-car" element={<ListMyCarPage />} />
        <Route path="owner/dashboard" element={<OwnerDashboard />} />
        <Route path="owner/requests" element={<ManageRequestsPage />} />
        <Route path="owner/active/:hireId" element={<ActiveHirePage />} />
        <Route path="owner/rate/:hireId" element={<RateFamilyPage />} />

        {/* Driver on Demand (Model 3) Driver Routes */}
        <Route path="m3/setup" element={<M3HireSetupPage />} />
        <Route path="m3/dashboard" element={<M3HireDashboard />} />
        <Route path="m3/navigate/:id" element={<M3NavigateToPickupPage />} />
        <Route path="m3/inspection/pre/:id" element={<M3PreInspectionPage />} />
        <Route path="m3/active/:id" element={<M3ActiveTripPage />} />
        <Route path="m3/inspection/post/:id" element={<M3PostInspectionPage />} />
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

        {/* Flexible Hire Passenger Routes */}
        <Route path="hire/request" element={<PostHireRequestPage />} />
        <Route path="hire/browse" element={<BrowseCarsPage />} />
        <Route path="hire/owner/:ownerId" element={<OwnerProfilePage />} />
        <Route path="hire/offers" element={<PassengerOffersPage />} />
        <Route path="hire/chat/:ownerId" element={<NegotiateChat />} />
        <Route path="hire/payment/:hireId" element={<HirePaymentPage />} />
        <Route path="hire/confirm/:hireId" element={<HireConfirmPage />} />
        <Route path="hire/track/:hireId" element={<HireTrackingPage />} />
        <Route path="hire/final/:hireId" element={<FinalPaymentPage />} />
        <Route path="hire/rate/:hireId" element={<RateOwnerPage />} />

        {/* Driver on Demand (Model 3) Family Routes */}
        <Route path="m3/request" element={<M3PostRequestPage />} />
        <Route path="m3/drivers" element={<M3BrowseDriversPage />} />
        <Route path="m3/offers/:id" element={<M3PassengerOffersPage />} />
        <Route path="m3/driver/:id" element={<M3DriverProfilePage />} />
        <Route path="m3/booking/confirm/:id" element={<M3ConfirmBookingPage />} />
        <Route path="m3/track/:id" element={<M3LiveTrackingPage />} />
        <Route path="m3/return/:id" element={<M3VehicleReturnPage />} />
        <Route path="m3/payment/:id" element={<M3FinalPaymentPage />} />
        <Route path="m3/rate/:id" element={<M3RateDriverPage />} />

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}