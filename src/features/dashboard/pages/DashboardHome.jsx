import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useBookings } from '../../../hooks/useBookings'
import { isCreator } from '../../../utils/roleHelpers'
import Button from '../../../components/ui/Button'
import './DashboardHome.css'

export default function DashboardHome() {
  const { user } = useAuth()
  const { bookings, getActiveBookings } = useBookings()

  useEffect(() => {
    getActiveBookings()
  }, [])

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.first_name}!</h1>
          <p>Manage your {isCreator(user) ? 'sessions and bookings' : 'bookings and profile'}</p>
        </div>
        <Link to="/profile">
          <Button variant="secondary">View Profile</Button>
        </Link>
      </div>

      <div className="dashboard-content">
        {!isCreator(user) && (
          <div className="dashboard-section">
            <h2>Your Active Bookings ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <div className="empty-state">
                <p>No active bookings</p>
                <Link to="/">
                  <Button>Explore Sessions</Button>
                </Link>
              </div>
            ) : (
              <div className="bookings-preview">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <h3>{booking.session?.title}</h3>
                    <p>{booking.session?.creator?.first_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isCreator(user) && (
          <div className="dashboard-actions">
            <Link to="/creator/sessions">
              <Button size="lg">Manage Sessions</Button>
            </Link>
            <Link to="/creator/bookings">
              <Button variant="secondary" size="lg">View Bookings</Button>
            </Link>
            <Link to="/creator/sessions/new">
              <Button size="lg">Create New Session</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
