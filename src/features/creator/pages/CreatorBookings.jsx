import React, { useEffect, useState } from 'react'
import { useBookings } from '../../../hooks/useBookings'
import Spinner from '../../../components/ui/Spinner'
import { formatDate, formatDateTime } from '../../../utils/formatDate'
import './CreatorBookings.css'

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  cancelled: { label: 'Cancelled', color: '#991b1b', bg: '#fef2f2', border: '#fecaca' },
  completed: { label: 'Completed', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
}

export default function CreatorBookings() {
  const { bookings, isLoading, error, getCreatorBookings } = useBookings()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getCreatorBookings()
  }, [])

  const filtered = bookings.filter((b) => filter === 'all' || b.status === filter)

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <div className="creator-bookings-page">
      <div className="cb-header">
        <div>
          <h1 className="cb-title">Bookings</h1>
          <p className="cb-subtitle">All bookings made on your sessions</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="cb-stats">
        <div className="cb-stat">
          <span className="cb-stat-value">{counts.all}</span>
          <span className="cb-stat-label">Total</span>
        </div>
        <div className="cb-stat cb-stat--confirmed">
          <span className="cb-stat-value">{counts.confirmed}</span>
          <span className="cb-stat-label">Confirmed</span>
        </div>
        <div className="cb-stat cb-stat--cancelled">
          <span className="cb-stat-value">{counts.cancelled}</span>
          <span className="cb-stat-label">Cancelled</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="cb-tabs">
        {['all', 'confirmed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={`cb-tab ${filter === tab ? 'cb-tab--active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="cb-tab-count">{counts[tab] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="cb-content">
        {isLoading ? (
          <div className="cb-loading">
            <Spinner size="lg" />
            <p>Loading bookings...</p>
          </div>
        ) : error && !bookings.length ? (
          <div className="cb-empty">
            <span className="cb-empty-icon">⚠️</span>
            <p>Failed to load bookings. <button className="cb-retry" onClick={() => getCreatorBookings()}>Try again</button></p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="cb-empty">
            <span className="cb-empty-icon">📋</span>
            <p>No {filter === 'all' ? '' : filter} bookings yet.</p>
          </div>
        ) : (
          <div className="cb-table-wrap">
            <table className="cb-table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Attendee</th>
                  <th>Session Date</th>
                  <th>Booked On</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => {
                  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed
                  return (
                    <tr key={booking.id}>
                      <td className="cb-td-session">{booking.session?.title || '—'}</td>
                      <td>{booking.user?.first_name || booking.user?.username || 'User'}</td>
                      <td>{booking.session?.scheduled_at ? formatDateTime(booking.session.scheduled_at) : '—'}</td>
                      <td>{booking.booked_at ? formatDate(booking.booked_at) : '—'}</td>
                      <td className="cb-td-price">${booking.session?.price || '—'}</td>
                      <td>
                        <span
                          className="cb-status-badge"
                          style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
