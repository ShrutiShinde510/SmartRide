import { Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import OnboardingPage from './pages/OnboardingPage';
import LanguagePage from './pages/LanguagePage';
import RoleSelectPage from './pages/RoleSelectPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import VerificationPage from './pages/VerificationPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/language" element={<LanguagePage />} />
      <Route path="/role-select" element={<RoleSelectPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/verification" element={<VerificationPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}