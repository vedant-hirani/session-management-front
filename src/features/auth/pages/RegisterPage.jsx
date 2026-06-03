import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Input from '../../../components/ui/Input'
import './LoginPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '', username: '', password: '', password2: '', role: 'user',
  })
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errors = {}
    if (!formData.email) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email'
    if (!formData.username) errors.username = 'Username is required'
    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 8) errors.password = 'At least 8 characters'
    if (formData.password !== formData.password2) errors.password2 = 'Passwords do not match'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length) { setFormErrors(errors); return }
    try {
      await register(formData.email, formData.username, formData.password, formData.password2, formData.role)
      navigate(formData.role === 'creator' ? '/creator' : '/dashboard', { replace: true })
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
            Join thousands of<br /><span>learners &amp; creators</span><br />today.
          </h2>
          <p className="auth-left-sub">
            Sign up as a learner to book sessions, or as a creator to host your own workshops and earn.
          </p>

          <div className="auth-left-features">
            <div className="auth-left-feature">
              <div className="auth-left-feature-icon">👤</div>
              Users browse &amp; book live sessions
            </div>
            <div className="auth-left-feature">
              <div className="auth-left-feature-icon">🎙</div>
              Creators host &amp; manage sessions
            </div>
            <div className="auth-left-feature">
              <div className="auth-left-feature-icon">🔒</div>
              Role is chosen once at sign-up
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1>Create account</h1>
            <p>Fill in your details to get started</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              placeholder="your@email.com"
              disabled={isLoading}
              autoComplete="email"
            />
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={formErrors.username}
              placeholder="Choose a username"
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
              placeholder="At least 8 characters"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              error={formErrors.password2}
              placeholder="Re-enter password"
              disabled={isLoading}
              autoComplete="new-password"
            />

            <div className="role-select-wrapper">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isLoading}
                className="role-select"
              >
                <option value="user">👤 User — browse &amp; book sessions</option>
                <option value="creator">🎙 Creator — host &amp; manage sessions</option>
              </select>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-footer-link">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
