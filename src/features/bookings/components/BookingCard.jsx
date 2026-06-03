import React, { useState } from 'react'
import { useBookings } from '../../../hooks/useBookings'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { formatDateTime } from '../../../utils/formatDate'
import './BookingCard.css'

export default function BookingCard({ booking }) {
  const { cancelBooking, isLoading } = useBookings()
  const [error, setError] = useState(null)

  const handleCancel = async () => {
    try {
      setError(null)
      await cancelBooking(booking.id)
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to cancel booking')
    }
  }

  const statusVariant = {
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'primary',
  }[booking.status] || 'primary'

  return (
    <div className="booking-card">
      {error && <div className="booking-error">{error}</div>}
      <div className="booking-content">
        <h3>{booking.session?.title}</h3>
        <div className="booking-details">
          <div className="detail-item">
            <span className="label">Scheduled:</span>
            <span>{formatDateTime(booking.session?.scheduled_at)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Price:</span>
            <span>${booking.session?.price}</span>
          </div>
          <div className="detail-item">
            <span className="label">Status:</span>
            <Badge variant={statusVariant}>{booking.status}</Badge>
          </div>
        </div>
      </div>
      {booking.status === 'confirmed' && (
        <Button
          variant="danger"
          size="sm"
          onClick={handleCancel}
          isLoading={isLoading}
        >
          Cancel
        </Button>
      )}
    </div>
  )
}
