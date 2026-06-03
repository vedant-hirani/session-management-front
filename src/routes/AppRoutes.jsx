import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../store/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { CreatorRoute } from './CreatorRoute'
import { PublicRoute } from './PublicRoute'
import Navbar from '../components/navigation/Navbar'

// Pages
import LoginPage from '../features/auth/pages/LoginPage'
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

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
          <Route path="/" element={<SessionsPage />} />
          <Route path="/sessions/:id" element={<SessionDetailPage />} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardHome />} />} />
          <Route path="/bookings" element={<ProtectedRoute element={<MyBookingsPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />

          {/* Protected Creator Routes */}
          <Route path="/creator" element={<CreatorRoute element={<CreatorDashboard />} />} />
          <Route path="/creator/sessions" element={<CreatorRoute element={<CreatorSessions />} />} />
          <Route path="/creator/bookings" element={<CreatorRoute element={<CreatorBookings />} />} />
          <Route path="/creator/sessions/new" element={<CreatorRoute element={<CreateSession />} />} />
          <Route path="/creator/sessions/:id/edit" element={<CreatorRoute element={<EditSession />} />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
