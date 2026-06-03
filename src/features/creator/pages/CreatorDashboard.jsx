import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSessions } from '../../../hooks/useSessions'
import { useBookings } from '../../../hooks/useBookings'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import './CreatorDashboard.css'

export default function CreatorDashboard() {
  const { sessions, getMySessions, isLoading: sessionsLoading } = useSessions()
  const { bookings, getCreatorBookings, isLoading: bookingsLoading } = useBookings()

  useEffect(() => {
    getMySessions()
    getCreatorBookings()
  }, [])

  const totalRevenue = sessions.reduce((sum, s) => sum + (parseFloat(s.price) * (s.max_attendees - s.spots_remaining)), 0)
  const isLoading = sessionsLoading || bookingsLoading

  return (
    <div className="creator-dashboard">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
      </div>

      {isLoading ? (
        <div className="loading">
          <Spinner size="lg" />
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
