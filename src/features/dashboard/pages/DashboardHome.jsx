import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useAuth } from '../../../hooks/useAuth'
import { useBookings } from '../../../hooks/useBookings'
import { useSessions } from '../../../hooks/useSessions'
import Spinner from '../../../components/ui/Spinner'
import { formatDate, formatDateTime } from '../../../utils/formatDate'
import './DashboardHome.css'

const PIE_COLORS = {
  confirmed: '#6366f1',
  cancelled: '#f43f5e',
  completed: '#10b981',
}

const AREA_COLOR = '#6366f1'

// Build month-by-month booking trend from raw bookings
function buildMonthlyTrend(bookings, months = 6) {
  const now = new Date()
  const result = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    const count = bookings.filter(b => {
      const bd = new Date(b.booked_at || b.created_at)
      return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth()
    }).length
    result.push({ month: label, bookings: count })
  }
  return result
}

function buildWeeklyTrend(bookings, weeks = 8) {
  const now = new Date()
  const result = []
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - i * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    const label = `W${weeks - i}`
    const count = bookings.filter(b => {
      const bd = new Date(b.booked_at || b.created_at)
      return bd >= weekStart && bd < weekEnd
    }).length
    result.push({ month: label, bookings: count })
  }
  return result
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="dh-tooltip">
        <p className="dh-tooltip-label">{label}</p>
        <p className="dh-tooltip-value">{payload[0].value} bookings</p>
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

export default function DashboardHome() {
  const { user } = useAuth()
  const { bookings, getMyBookings, isLoading: bookingsLoading } = useBookings()
  const { sessions, listSessions, isLoading: sessionsLoading } = useSessions()
  const [bookingFilter, setBookingFilter] = useState('all')
  const [trendRange, setTrendRange] = useState('monthly')

  useEffect(() => {
    getMyBookings()
    listSessions({ page_size: 6 })
  }, [])

  const isLoading = bookingsLoading || sessionsLoading

  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const cancelled = bookings.filter(b => b.status === 'cancelled').length
  const completed = bookings.filter(b => b.status === 'completed').length
  const total = bookings.length

  const pieData = [
    { name: 'Confirmed', value: confirmed },
    { name: 'Cancelled', value: cancelled },
    { name: 'Completed', value: completed },
  ].filter(d => d.value > 0)

  const trendData = useMemo(() =>
    trendRange === 'monthly' ? buildMonthlyTrend(bookings, 6) : buildWeeklyTrend(bookings, 8),
    [bookings, trendRange]
  )

  const filteredBookings = bookings
    .filter(b => bookingFilter === 'all' ? true : b.status === bookingFilter)
    .slice(0, 5)

  if (isLoading && !bookings.length && !sessions.length) {
    return (
      <div className="dh-loading">
        <Spinner size="lg" />
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dh-page">

      {/* Hero */}
      <div className="dh-hero">
        <div>
          <p className="dh-greeting">{greeting()},</p>
          <h1 className="dh-name">{user?.first_name || user?.username} 👋</h1>
          <p className="dh-tagline">Here's your booking activity at a glance.</p>
        </div>
        <Link to="/sessions" className="dh-cta-btn">Browse Sessions →</Link>
      </div>

      {/* Stat cards */}
      <div className="dh-stats">
        {[
          { label: 'Total', value: total, color: '#6366f1', icon: '📋' },
          { label: 'Confirmed', value: confirmed, color: '#10b981', icon: '✅' },
          { label: 'Cancelled', value: cancelled, color: '#f43f5e', icon: '✕' },
          { label: 'Completed', value: completed, color: '#3b82f6', icon: '🎓' },
        ].map(s => (
          <div key={s.label} className="dh-stat-card" style={{ borderTopColor: s.color }}>
            <div className="dh-stat-top">
              <span className="dh-stat-label">{s.label}</span>
            </div>
            <div className="dh-stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="dh-charts-row">

        {/* Area chart — booking trend */}
        <div className="dh-card dh-card--chart">
          <div className="dh-card-header">
            <div>
              <h2 className="dh-card-title">Booking Trend</h2>
              <p className="dh-card-sub">Your bookings over time</p>
            </div>
            <div className="dh-seg">
              <button
                className={`dh-seg-btn ${trendRange === 'monthly' ? 'active' : ''}`}
                onClick={() => setTrendRange('monthly')}
              >Monthly</button>
              <button
                className={`dh-seg-btn ${trendRange === 'weekly' ? 'active' : ''}`}
                onClick={() => setTrendRange('weekly')}
              >Weekly</button>
            </div>
          </div>
          {total === 0 ? (
            <div className="dh-chart-empty">No booking data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={AREA_COLOR} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={AREA_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke={AREA_COLOR}
                  strokeWidth={2.5}
                  fill="url(#bookingGrad)"
                  dot={{ fill: AREA_COLOR, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: AREA_COLOR }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart — booking status */}
        <div className="dh-card dh-card--pie">
          <div className="dh-card-header">
            <div>
              <h2 className="dh-card-title">Status Breakdown</h2>
              <p className="dh-card-sub">Distribution by status</p>
            </div>
          </div>
          {pieData.length === 0 ? (
            <div className="dh-chart-empty">No booking data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name.toLowerCase()] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} bookings`, name]}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {total > 0 && (
            <div className="dh-pie-center-label">
              <span className="dh-pie-total">{total}</span>
              <span className="dh-pie-sub">total</span>
            </div>
          )}
        </div>
      </div>

      {/* Bookings list + Discover sessions */}
      <div className="dh-bottom-row">

        {/* Bookings list */}
        <div className="dh-card">
          <div className="dh-card-header">
            <h2 className="dh-card-title">Recent Bookings</h2>
            <div className="dh-filter-tabs">
              {['all', 'confirmed', 'cancelled'].map(f => (
                <button
                  key={f}
                  className={`dh-filter-tab ${bookingFilter === f ? 'active' : ''}`}
                  onClick={() => setBookingFilter(f)}
                >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
          </div>
          {filteredBookings.length === 0 ? (
            <div className="dh-empty">
              <p>No {bookingFilter === 'all' ? '' : bookingFilter} bookings.</p>
              <Link to="/sessions" className="dh-link">Browse sessions →</Link>
            </div>
          ) : (
            <div className="dh-list">
              {filteredBookings.map(b => (
                <div key={b.id} className="dh-list-row">
                  <div className="dh-list-img">
                    {b.session?.cover_image
                      ? <img src={b.session.cover_image} alt="" />
                      : <span>🎓</span>}
                  </div>
                  <div className="dh-list-info">
                    <p className="dh-list-title">
                      <Link to={`/sessions/${b.session?.id}`}>{b.session?.title}</Link>
                    </p>
                    <p className="dh-list-meta">
                      {b.session?.scheduled_at ? formatDateTime(b.session.scheduled_at) : '—'}
                      {b.session?.price ? ` · $${b.session.price}` : ''}
                    </p>
                  </div>
                  <span className={`dh-pill dh-pill--${b.status}`}>{b.status}</span>
                </div>
              ))}
              {bookings.length > 5 && (
                <Link to="/bookings" className="dh-view-all">View all {bookings.length} →</Link>
              )}
            </div>
          )}
        </div>

        {/* Discover sessions */}
        <div className="dh-card">
          <div className="dh-card-header">
            <h2 className="dh-card-title">Discover Sessions</h2>
            <Link to="/sessions" className="dh-link">See all →</Link>
          </div>
          {sessions.length === 0 ? (
            <div className="dh-empty"><p>No sessions available.</p></div>
          ) : (
            <div className="dh-list">
              {sessions.slice(0, 5).map(s => (
                <Link key={s.id} to={`/sessions/${s.id}`} className="dh-list-row dh-list-row--link">
                  <div className="dh-list-img">
                    {s.cover_image ? <img src={s.cover_image} alt="" /> : <span>🎓</span>}
                  </div>
                  <div className="dh-list-info">
                    <p className="dh-list-title">{s.title}</p>
                    <p className="dh-list-meta">{formatDate(s.scheduled_at)} · ${s.price}</p>
                  </div>
                  <span className="dh-spots-pill">{s.spots_remaining} left</span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
