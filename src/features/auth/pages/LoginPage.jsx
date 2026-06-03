import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Input from '../../../components/ui/Input'
import './LoginPage.css'

const GOOGLE_OAUTH_URL = 'http://127.0.0.1:8000/social/login/google-oauth2/'

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
      {/* ── Left branding panel ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">
            <div className="auth-left-logo-icon">🎓</div>
            <span className="auth-left-logo-name">Sessions Marketplace</span>
          </div>
          <h2 className="auth-left-tagline">
            Learn from the<br /><span>best creators</span><br />in the world.
          </h2>
          <p className="auth-left-sub">
            Discover live sessions, workshops, and mentorship from experts across every field.
          </p>
          <div className="auth-left-features">
            <div className="auth-left-feature">
              <div className="auth-left-feature-icon">🚀</div>
              Book sessions instantly — no waiting
            </div>
            <div className="auth-left-feature">
              <div className="auth-left-feature-icon">💰</div>
              Wallet-based refunds if sessions cancel
            </div>
            <div className="auth-left-feature">
              <div className="auth-left-feature-icon">🎙</div>
              Become a creator and host your own sessions
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
