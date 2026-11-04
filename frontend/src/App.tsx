import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ApplyPage from './pages/ApplyPage'
import ApplicationSuccessPage from './pages/ApplicationSuccessPage'
import ApplicationStatusPage from './pages/ApplicationStatusPage'
import LeaderboardPage from './pages/LeaderboardPage'
import VerifyCertificatePage from './pages/VerifyCertificatePage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminApplicationPage from './pages/admin/AdminApplicationPage'
import { AdminRoute } from './components/layout/AdminRoute'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/application-success" element={<ApplicationSuccessPage />} />
      <Route path="/application-status" element={<ApplicationStatusPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
      <Route path="/verify-certificate/:certId" element={<VerifyCertificatePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="applications/:id" element={<AdminApplicationPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
