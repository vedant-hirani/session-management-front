import React, { useEffect } from 'react'
import { useBookings } from '../../../hooks/useBookings'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'
import BookingCard from '../components/BookingCard'
import './MyBookingsPage.css'

export default function MyBookingsPage() {
  const { bookings, isLoading, error, getMyBookings } = useBookings()

  useEffect(() => {
    getMyBookings()
  }, [])

  const handleRetry = () => {
    getMyBookings()
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Manage your upcoming sessions</p>
      </div>

      <div className="bookings-content">
        {isLoading ? (
          <div className="bookings-loading">
            <Spinner size="lg" />
            <p>Loading your bookings...</p>
          </div>
        ) : error && !bookings.length ? (
          <div className="bookings-error-state">
            <div className="error-icon">⚠️</div>
            <h2>Unable to Load Bookings</h2>
            <p>We're having trouble connecting to our services. Please try again.</p>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty">
            <p>You haven't booked any sessions yet</p>
            <p className="empty-subtitle">Explore sessions to find and book experiences</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
        
        {error && bookings.length > 0 && (
          <div className="bookings-warning">
            <p>Some bookings couldn't be loaded. Showing available bookings.</p>
          </div>
        )}
      </div>
    </div>
  )
}
