import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { formatDateTime, formatDate } from '../../../utils/formatDate'
import './BookingCard.css'

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  cancelled: { label: 'Cancelled', color: '#991b1b', bg: '#fef2f2', border: '#fecaca' },
  completed: { label: 'Completed', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
}

export default function BookingCard({ booking, onCancel, isCancelling }) {
  const session = booking.session || {}
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed
  const isConfirmed = booking.status === 'confirmed'

  return (
    <div className="booking-card">
      {/* Image */}
      <div className="booking-card-image">
        {session.cover_image ? (
          <img src={session.cover_image} alt={session.title} />
        ) : (
          <div className="booking-card-image-placeholder">🎓</div>
        )}
      </div>

      {/* Content */}
      <div className="booking-card-body">
        <div className="booking-card-top">
          <div className="booking-card-info">
            <h3 className="booking-session-title">
              <Link to={`/sessions/${session.id}`}>{session.title || 'Session'}</Link>
            </h3>
            <div className="booking-meta">
              {session.scheduled_at && (
                <span className="booking-meta-item">📅 {formatDateTime(session.scheduled_at)}</span>
              )}
              {session.duration_minutes && (
                <span className="booking-meta-item">⏱ {session.duration_minutes} min</span>
              )}
              {session.price && (
                <span className="booking-meta-item">💰 ${session.price}</span>
              )}
            </div>
          </div>

          <div
            className="booking-status-badge"
            style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
          >
            {status.label}
          </div>
        </div>

        <div className="booking-card-footer">
          <span className="booking-booked-on">
            Booked on {formatDate(booking.booked_at)}
          </span>
          {isConfirmed && onCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel(booking.id)}
              isLoading={isCancelling}
              disabled={isCancelling}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
