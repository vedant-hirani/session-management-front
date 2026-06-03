import React, { useEffect } from 'react'
import { useBookings } from '../../../hooks/useBookings'
import Spinner from '../../../components/ui/Spinner'
import BookingCard from '../components/BookingCard'
import './MyBookingsPage.css'

export default function MyBookingsPage() {
  const { bookings, isLoading, error, getMyBookings } = useBookings()

  useEffect(() => {
    getMyBookings()
  }, [])

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
          </div>
        ) : error ? (
          <div className="bookings-error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty">
            <p>You haven't booked any sessions yet</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
