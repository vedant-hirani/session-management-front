import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Input from '../../../components/ui/Input'
import './LoginPage.css'

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
