import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Input from '../../../components/ui/Input'
import './LoginPage.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const GOOGLE_OAUTH_URL = `${API_BASE_URL}/social/login/google-oauth2/`

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [formErrors, setFormErrors] = useState({})

  // Showcase UI States
  const [activeSlot, setActiveSlot] = useState('10:00 AM')
  const [bookingStatus, setBookingStatus] = useState('Book')
  const [countdownMinutes, setCountdownMinutes] = useState(14)
  const [countdownSeconds, setCountdownSeconds] = useState(20)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1
        setCountdownMinutes((prevMin) => {
          if (prevMin > 0) return prevMin - 1
          return 14 // Reset mock timer
        })
        return 59
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMiniBook = () => {
    setBookingStatus('Confirmed! ✓')
    setTimeout(() => {
      setBookingStatus('Book')
    }, 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errors = {}
    if (!formData.username) errors.username = 'Username is required'
    if (!formData.password) errors.password = 'Password is required'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length) { setFormErrors(errors); return }
    try {
      const profile = await login(formData.username, formData.password)
      navigate(profile?.role === 'creator' ? '/creator' : '/dashboard', { replace: true })
    } catch (_) {}
  }

  return (
    <div className="auth-page">
      {/* ── Left branding panel with rich interactive showcase ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">
            <span className="logo-symbol">◆</span>
            <span className="auth-left-logo-name">Sessions</span>
          </div>

          <div className="showcase-introduction">
            <h2>The premier session infrastructure</h2>
            <p>Experience the booking workspace in real-time. Direct channels, secure logs, native video rooms.</p>
          </div>

          {/* Interactive showcase card layout */}
          <div className="auth-showcase-container">
            {/* Widget 1: Creator Profile Card */}
            <div className="showcase-card expert-card float-1">
              <div className="card-header-mini">
                <div className="avatar-circle-mini">💻</div>
                <div className="expert-info-mini">
                  <h4>Sarah Jenkins</h4>
                  <span>Principal Architect, Google</span>
                </div>
              </div>
              <div className="card-meta-mini">
                <span className="rating-pill-mini">★ 4.9</span>
                <span className="rate-pill-mini">$150/hr</span>
              </div>
            </div>

            {/* Widget 2: Booking slot picker preview */}
            <div className="showcase-card booking-picker-card float-2">
              <div className="card-sec-title">Availability Slots</div>
              <div className="slots-strip-mini">
                {['09:00 AM', '10:00 AM', '02:30 PM'].map((slot) => (
                  <button
                    key={slot}
                    className={`slot-chip-mini ${activeSlot === slot ? 'active' : ''}`}
                    onClick={() => slot !== '09:00 AM' && setActiveSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <button className="book-session-mini-btn" onClick={handleMiniBook}>
                {bookingStatus === 'Book' ? `Book Session: ${activeSlot}` : bookingStatus}
              </button>
            </div>

            {/* Widget 3: Live countdown card */}
            <div className="showcase-card upcoming-card float-3">
              <div className="upcoming-top">
                <span className="live-status-pill-mini">UPCOMING SESSION</span>
                <span className="timer-countdown">
                  {countdownMinutes}:{countdownSeconds < 10 ? `0${countdownSeconds}` : countdownSeconds}
                </span>
              </div>
              <h4>System Scale Review</h4>
              <p>with Marcus Sterling (Y-Combinator)</p>
            </div>

            {/* Widget 4: Stream activity alerts */}
            <div className="showcase-card activity-feed-card">
              <div className="card-sec-title">Activity Stream</div>
              <div className="feed-item-mini">
                <span className="feed-status-dot active"></span>
                <span>Alex K. scheduled 1:1 Tech Consultation</span>
              </div>
              <div className="feed-item-mini">
                <span className="feed-status-dot completed"></span>
                <span>Julia R. completed rating for Elena Rostova</span>
              </div>
            </div>

            {/* Widget 5: Dashboard preview analytics */}
            <div className="showcase-card dashboard-preview-card">
              <div className="mini-metric-col">
                <span>Active Bookings</span>
                <strong>14,290</strong>
              </div>
              <div className="mini-metric-col">
                <span>Fulfillment Velocity</span>
                <strong>98.4%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {/* Google OAuth */}
          <a href={GOOGLE_OAUTH_URL} className="google-btn">
            <GoogleIcon />
            Continue with Google
          </a>

          <div className="auth-or-divider">or sign in with email</div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Username or Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={formErrors.username}
              placeholder="Enter your username"
              disabled={isLoading}
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-footer-link">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
