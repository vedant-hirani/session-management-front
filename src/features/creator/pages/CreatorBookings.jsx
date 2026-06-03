import React, { useEffect } from 'react'
import { useBookings } from '../../../hooks/useBookings'
import Spinner from '../../../components/ui/Spinner'
import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/formatDate'
import './CreatorBookings.css'

export default function CreatorBookings() {
  const { bookings, isLoading, error, getCreatorBookings } = useBookings()

  useEffect(() => {
    getCreatorBookings()
  }, [])

  return (
    <div className="creator-bookings">
      <div className="bookings-header">
        <h1>Bookings on Your Sessions</h1>
      </div>

      <div className="bookings-content">
        {isLoading ? (
          <div className="loading">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="empty">
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Attendee</th>
                  <th>Booked Date</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.session?.title}</td>
                    <td>{booking.user?.first_name || 'User'}</td>
                    <td>{formatDate(booking.created_at)}</td>
                    <td>${booking.session?.price}</td>
                    <td><Badge variant={booking.status === 'confirmed' ? 'success' : 'danger'}>{booking.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
