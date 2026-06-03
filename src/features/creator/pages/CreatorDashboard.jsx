import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSessions } from '../../../hooks/useSessions'
import { useBookings } from '../../../hooks/useBookings'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import './CreatorDashboard.css'

export default function CreatorDashboard() {
  const { sessions, getMySessions, isLoading: sessionsLoading, error: sessionsError } = useSessions()
  const { bookings, getCreatorBookings, isLoading: bookingsLoading, error: bookingsError } = useBookings()
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    getMySessions()
    getCreatorBookings()
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const totalRevenue = sessions.reduce((sum, s) => sum + (parseFloat(s.price) * (s.max_attendees - s.spots_remaining)), 0)
  const isLoading = sessionsLoading || bookingsLoading
  const hasError = (sessionsError || bookingsError) && !sessions.length && !bookings.length

  return (
    <div className="creator-dashboard">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
      </div>

      {isLoading ? (
        <div className="loading">
          <Spinner size="lg" />
          <p>Loading your dashboard...</p>
        </div>
      ) : hasError ? (
        <div className="dashboard-error-state">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Dashboard</h2>
          <p>We're having trouble connecting to our services. Please try again.</p>
          <Button onClick={handleRetry}>Try Again</Button>
        </div>
      ) : (
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{sessions.length}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${totalRevenue.toFixed(2)}</div>
              <div className="stat-label">Estimated Revenue</div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-grid">
              <Link to="/creator/sessions">
                <Button size="lg">Manage Sessions</Button>
              </Link>
              <Link to="/creator/sessions/new">
                <Button size="lg">Create New Session</Button>
              </Link>
              <Link to="/creator/bookings">
                <Button variant="secondary" size="lg">View Bookings</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
