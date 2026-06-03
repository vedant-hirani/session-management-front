import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts'
import { useAuth } from '../../../hooks/useAuth'
import { useSessions } from '../../../hooks/useSessions'
import { useBookings } from '../../../hooks/useBookings'
import Spinner from '../../../components/ui/Spinner'
import { formatDate, formatDateTime } from '../../../utils/formatDate'
import './CreatorDashboard.css'

const SESSION_PIE_COLORS = {
  published: '#6366f1',
  draft: '#f59e0b',
  cancelled: '#f43f5e',
}

const BOOKING_PIE_COLORS = {
  confirmed: '#10b981',
  cancelled: '#f43f5e',
  completed: '#3b82f6',
}

function buildRevenueByMonth(bookings, months = 6) {
  const now = new Date()
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    const label = d.toLocaleString('default', { month: 'short' })
    // Sum price of confirmed bookings whose session falls in this month
    const revenue = bookings
      .filter(b => {
        if (b.status !== 'confirmed') return false
        const bd = new Date(b.booked_at || b.created_at)
        return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth()
      })
      .reduce((sum, b) => sum + parseFloat(b.session?.price || 0), 0)
    return { month: label, revenue: parseFloat(revenue.toFixed(2)) }
  })
}

function buildBookingsByMonth(bookings, months = 6) {
  const now = new Date()
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    const label = d.toLocaleString('default', { month: 'short' })
    const count = bookings.filter(b => {
      const bd = new Date(b.booked_at || b.created_at)
      return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth()
    }).length
    return { month: label, bookings: count }
  })
}

const RevenueTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="cd-tooltip">
        <p className="cd-tooltip-label">{label}</p>
        <p className="cd-tooltip-value">${payload[0].value}</p>
      </div>
    )
  }
  return null
}

const BookingTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="cd-tooltip">
        <p className="cd-tooltip-label">{label}</p>
        <p className="cd-tooltip-value">{payload[0].value} bookings</p>
      </div>
    )
  }
  return null
}

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function CreatorDashboard() {
  const { user } = useAuth()
  const { sessions, getMySessions, isLoading: sessionsLoading } = useSessions()
  const { bookings, getCreatorBookings, isLoading: bookingsLoading } = useBookings()
  const [sessionFilter, setSessionFilter] = useState('all')
  const [revenueRange, setRevenueRange] = useState(6)

  useEffect(() => {
    getMySessions()
    getCreatorBookings()
  }, [])

  const isLoading = sessionsLoading || bookingsLoading

  const published = sessions.filter(s => s.status === 'published').length
  const draft = sessions.filter(s => s.status === 'draft').length
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled').length

  // Revenue = sum of (price * confirmed bookings count) derived from actual bookings data
  // Use bookings array since spots_remaining can be stale or mismatched
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + parseFloat(b.session?.price || 0), 0)

  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length

  const sessionPieData = [
    { name: 'Published', value: published },
    { name: 'Draft', value: draft },
    { name: 'Cancelled', value: cancelledSessions },
  ].filter(d => d.value > 0)

  const bookingPieData = [
    { name: 'Confirmed', value: confirmedBookings },
    { name: 'Cancelled', value: cancelledBookings },
  ].filter(d => d.value > 0)

  const revenueData = useMemo(() => buildRevenueByMonth(bookings, revenueRange), [bookings, revenueRange])
  const bookingTrendData = useMemo(() => buildBookingsByMonth(bookings, 6), [bookings])

  const filteredSessions = sessions
    .filter(s => sessionFilter === 'all' ? true : s.status === sessionFilter)
    .slice(0, 5)

  if (isLoading && !sessions.length && !bookings.length) {
    return (
      <div className="cd-loading">
        <Spinner size="lg" />
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="cd-page">

      {/* Hero */}
      <div className="cd-hero">
        <div>
          <p className="cd-greeting">{greeting()},</p>
          <h1 className="cd-name">{user?.first_name || user?.username} 🎓</h1>
          <p className="cd-tagline">Your creator performance overview.</p>
        </div>
        <Link to="/creator/sessions/new" className="cd-cta-btn">+ Create Session</Link>
      </div>

      {/* Stat cards */}
      <div className="cd-stats">
        {[
          { label: 'Sessions', value: sessions.length, color: '#6366f1' },
          { label: 'Bookings', value: totalBookings, color: '#f59e0b' },
          { label: 'Confirmed', value: confirmedBookings, color: '#10b981' },
          { label: 'Revenue', value: `$${totalRevenue.toFixed(0)}`, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="cd-stat-card" style={{ borderTopColor: s.color }}>
            <div className="cd-stat-label">{s.label}</div>
            <div className="cd-stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 — Revenue area + Booking trend bar */}
      <div className="cd-charts-row">
        <div className="cd-card">
          <div className="cd-card-header">
            <div>
              <h2 className="cd-card-title">Revenue Over Time</h2>
              <p className="cd-card-sub">Estimated earnings per month</p>
            </div>
            <div className="cd-seg">
              {[3, 6, 12].map(m => (
                <button
                  key={m}
                  className={`cd-seg-btn ${revenueRange === m ? 'active' : ''}`}
                  onClick={() => setRevenueRange(m)}
                >{m}M</button>
              ))}
            </div>
          </div>
          {totalRevenue === 0 ? (
            <div className="cd-chart-empty">No revenue data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} domain={[0, 'auto']} />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5}
                  fill="url(#revGrad)" dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="cd-card">
          <div className="cd-card-header">
            <div>
              <h2 className="cd-card-title">Bookings per Month</h2>
              <p className="cd-card-sub">Last 6 months</p>
            </div>
          </div>
          {totalBookings === 0 ? (
            <div className="cd-chart-empty">No booking data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bookingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<BookingTooltip />} />
                <Bar dataKey="bookings" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2 — Pie charts */}
      <div className="cd-pie-row">
        <div className="cd-card cd-card--pie">
          <div className="cd-card-header">
            <div>
              <h2 className="cd-card-title">Sessions by Status</h2>
              <p className="cd-card-sub">Published vs Draft vs Cancelled</p>
            </div>
          </div>
          {sessionPieData.length === 0 ? (
            <div className="cd-chart-empty">No sessions yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sessionPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {sessionPieData.map(entry => (
                    <Cell key={entry.name} fill={SESSION_PIE_COLORS[entry.name.toLowerCase()] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}`, n]}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="cd-card cd-card--pie">
          <div className="cd-card-header">
            <div>
              <h2 className="cd-card-title">Bookings by Status</h2>
              <p className="cd-card-sub">Confirmed vs Cancelled</p>
            </div>
          </div>
          {bookingPieData.length === 0 ? (
            <div className="cd-chart-empty">No bookings yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bookingPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {bookingPieData.map(entry => (
                    <Cell key={entry.name} fill={BOOKING_PIE_COLORS[entry.name.toLowerCase()] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}`, n]}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top sessions by fill rate */}
        <div className="cd-card">
          <div className="cd-card-header">
            <h2 className="cd-card-title">Session Fill Rate</h2>
            <p className="cd-card-sub" style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Published only</p>
          </div>
          {sessions.filter(s => s.status === 'published').length === 0 ? (
            <div className="cd-chart-empty">No published sessions.</div>
          ) : (
            <div className="cd-fill-list">
              {sessions.filter(s => s.status === 'published').slice(0, 5).map(s => {
                const booked = (s.max_attendees || 0) - (s.spots_remaining || 0)
                const pct = s.max_attendees > 0 ? Math.round((booked / s.max_attendees) * 100) : 0
                return (
                  <div key={s.id} className="cd-fill-item">
                    <div className="cd-fill-header">
                      <span className="cd-fill-title">{s.title.length > 28 ? s.title.slice(0, 28) + '…' : s.title}</span>
                      <span className="cd-fill-pct">{pct}%</span>
                    </div>
                    <div className="cd-fill-track">
                      <div className="cd-fill-bar"
                        style={{ width: `${pct}%`, background: pct > 75 ? '#10b981' : pct > 40 ? '#6366f1' : '#f59e0b' }} />
                    </div>
                    <span className="cd-fill-sub">{booked} / {s.max_attendees} spots filled</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sessions table */}
      <div className="cd-card">
        <div className="cd-card-header">
          <h2 className="cd-card-title">My Sessions</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className="cd-filter-tabs">
              {['all', 'published', 'draft', 'cancelled'].map(f => (
                <button key={f}
                  className={`cd-filter-tab ${sessionFilter === f ? 'active' : ''}`}
                  onClick={() => setSessionFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <Link to="/creator/sessions" className="cd-link">View all →</Link>
          </div>
        </div>
        {filteredSessions.length === 0 ? (
          <div className="cd-empty">
            <p>No sessions yet. <Link to="/creator/sessions/new" className="cd-link">Create one →</Link></p>
          </div>
        ) : (
          <div className="cd-sessions-list">
            {filteredSessions.map(s => (
              <div key={s.id} className="cd-session-row">
                <div className="cd-session-img">
                  {s.cover_image ? <img src={s.cover_image} alt="" /> : <span>🎓</span>}
                </div>
                <div className="cd-session-info">
                  <p className="cd-session-title">{s.title}</p>
                  <p className="cd-session-meta">
                    {formatDate(s.scheduled_at)} · ${s.price} · {(s.max_attendees || 0) - (s.spots_remaining || 0)}/{s.max_attendees} booked
                  </p>
                </div>
                <div className="cd-session-right">
                  <span className={`cd-pill cd-pill--${s.status}`}>{s.status}</span>
                  <Link to={`/creator/sessions/${s.id}/edit`} className="cd-link cd-edit-link">Edit →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent bookings + Quick actions */}
      <div className="cd-bottom-row">
        <div className="cd-card">
          <div className="cd-card-header">
            <h2 className="cd-card-title">Recent Bookings</h2>
            <Link to="/creator/bookings" className="cd-link">See all →</Link>
          </div>
          {bookings.length === 0 ? (
            <div className="cd-empty"><p>No bookings yet.</p></div>
          ) : (
            <div className="cd-booking-list">
              {bookings.slice(0, 6).map(b => (
                <div key={b.id} className="cd-booking-row">
                  <div className="cd-booking-avatar">
                    {(b.user?.first_name?.[0] || b.user?.username?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="cd-booking-info">
                    <p className="cd-booking-user">{b.user?.first_name || b.user?.username || 'User'}</p>
                    <p className="cd-booking-session">{b.session?.title}</p>
                  </div>
                  <span className={`cd-pill cd-pill--${b.status}`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cd-card">
          <div className="cd-card-header">
            <h2 className="cd-card-title">Quick Actions</h2>
          </div>
          <div className="cd-actions">
            <Link to="/creator/sessions/new" className="cd-action-btn cd-action-btn--primary">
              <span>➕</span> Create New Session
            </Link>
            <Link to="/creator/sessions" className="cd-action-btn">
              <span>📚</span> Manage Sessions
            </Link>
            <Link to="/creator/bookings" className="cd-action-btn">
              <span>📋</span> All Bookings
            </Link>
            <Link to="/sessions" className="cd-action-btn">
              <span>🌐</span> Browse Marketplace
            </Link>
            <Link to="/profile" className="cd-action-btn">
              <span>👤</span> Edit Profile
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
