import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../store/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { CreatorRoute } from './CreatorRoute'
import { PublicRoute } from './PublicRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Navbar from '../components/navigation/Navbar'
import { useAuth } from '../hooks/useAuth'
import { isCreator } from '../utils/roleHelpers'
import Spinner from '../components/ui/Spinner'

// Pages
import LandingPage from '../features/landing/pages/LandingPage'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import SessionsPage from '../features/sessions/pages/SessionsPage'
import SessionDetailPage from '../features/sessions/pages/SessionDetailPage'
import MyBookingsPage from '../features/bookings/pages/MyBookingsPage'
import DashboardHome from '../features/dashboard/pages/DashboardHome'
import CreatorDashboard from '../features/creator/pages/CreatorDashboard'
import CreatorSessions from '../features/creator/pages/CreatorSessions'
import CreatorBookings from '../features/creator/pages/CreatorBookings'
import CreateSession from '../features/creator/pages/CreateSession'
import EditSession from '../features/creator/pages/EditSession'
import ProfilePage from '../features/profile/pages/ProfilePage'

// Smart root — show landing or redirect to dashboard
function HomeRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    )
  }
  if (isAuthenticated) {
    return <Navigate to={isCreator(user) ? '/creator' : '/dashboard'} replace />
  }
  return <LandingPage />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing only — no sidebar, no navbar */}
          <Route path="/" element={<HomeRoute />} />

          {/* Auth pages — full screen centered, no navbar/sidebar */}
          <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
          <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />

          {/* Everything else — sidebar layout */}
          <Route path="/sessions" element={<ProtectedRoute element={<DashboardLayout><SessionsPage /></DashboardLayout>} />} />
          <Route path="/sessions/:id" element={<ProtectedRoute element={<DashboardLayout><SessionDetailPage /></DashboardLayout>} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardLayout><DashboardHome /></DashboardLayout>} />} />
          <Route path="/bookings" element={<ProtectedRoute element={<DashboardLayout><MyBookingsPage /></DashboardLayout>} />} />
          <Route path="/profile" element={<ProtectedRoute element={<DashboardLayout><ProfilePage /></DashboardLayout>} />} />

          {/* Creator routes — sidebar layout */}
          <Route path="/creator" element={<CreatorRoute element={<DashboardLayout><CreatorDashboard /></DashboardLayout>} />} />
          <Route path="/creator/sessions" element={<CreatorRoute element={<DashboardLayout><CreatorSessions /></DashboardLayout>} />} />
          <Route path="/creator/bookings" element={<CreatorRoute element={<DashboardLayout><CreatorBookings /></DashboardLayout>} />} />
          <Route path="/creator/sessions/new" element={<CreatorRoute element={<DashboardLayout><CreateSession /></DashboardLayout>} />} />
          <Route path="/creator/sessions/:id/edit" element={<CreatorRoute element={<DashboardLayout><EditSession /></DashboardLayout>} />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
