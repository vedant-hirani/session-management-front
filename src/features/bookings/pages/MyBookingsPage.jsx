import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBookings } from '../../../hooks/useBookings'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'
import BookingCard from '../components/BookingCard'
import ConfirmModal from '../../../components/ui/ConfirmModal'
import './MyBookingsPage.css'

export default function MyBookingsPage() {
  const { bookings, isLoading, error, getMyBookings, cancelBooking } = useBookings()
  const [filter, setFilter] = useState('all')
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)   // booking id pending confirm
  const [actionError, setActionError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => { loadBookings() }, [])

  const loadBookings = async () => {
    try { await getMyBookings() } catch (_) {}
  }

  // Step 1 — open modal
  const handleCancelRequest = (bookingId) => {
    setConfirmId(bookingId)
  }

  // Step 2 — user confirmed in modal
  const handleCancelConfirm = async () => {
    const bookingId = confirmId
    setConfirmId(null)
    try {
      setActionError('')
      setSuccessMsg('')
      setCancellingId(bookingId)
      await cancelBooking(bookingId)
      setSuccessMsg('Booking cancelled and refund added to your wallet.')
      await loadBookings()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Failed to cancel booking.')
    } finally {
      setCancellingId(null)
    }
  }

  const filtered = bookings.filter((b) =>
    filter === 'all' ? true : b.status === filter
  )

  return (
    <div className="bookings-page">
      {/* UI Confirm Modal — no window.confirm */}
      <ConfirmModal
        isOpen={confirmId !== null}
        title="Cancel this booking?"
        message="Your booking will be cancelled and the amount will be refunded to your wallet."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Booking"
        variant="danger"
        onConfirm={handleCancelConfirm}
        onCancel={() => setConfirmId(null)}
      />

      <div className="bookings-page-header">
        <div>
          <h1 className="bookings-title">My Bookings</h1>
          <p className="bookings-subtitle">View and manage your session bookings</p>
        </div>
        <Link to="/sessions"><Button>Browse Sessions</Button></Link>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {actionError && <div className="alert alert-error">{actionError}</div>}

      <div className="bookings-tabs">
        {['all', 'confirmed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${filter === tab ? 'tab-btn--active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="tab-count">
              {tab === 'all' ? bookings.length : bookings.filter((b) => b.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bookings-content">
        {isLoading ? (
          <div className="bookings-loading">
            <Spinner size="lg" />
            <p>Loading your bookings...</p>
          </div>
        ) : error && !bookings.length ? (
          <div className="bookings-empty-state">
            <span className="empty-icon">⚠️</span>
            <p>Failed to load bookings.</p>
            <Button onClick={loadBookings}>Try Again</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bookings-empty-state">
            <span className="empty-icon">📋</span>
            <p>{filter === 'all' ? "You haven't booked any sessions yet." : `No ${filter} bookings.`}</p>
            {filter === 'all' && <Link to="/sessions"><Button>Browse Sessions</Button></Link>}
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelRequest}
                isCancelling={cancellingId === booking.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
