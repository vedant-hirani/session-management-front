import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import './LoginPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    role: 'user',
  })
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    if (!formData.username) errors.username = 'Username is required'
    if (!formData.password) errors.password = 'Password is required'
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters'
    if (!formData.password2) errors.password2 = 'Please confirm your password'
    if (formData.password !== formData.password2) errors.password2 = 'Passwords do not match'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      const profile = await register(
        formData.email,
        formData.username,
        formData.password,
        formData.password2,
        formData.role
      )
      // Role is fixed at registration — route to the right dashboard
      navigate(formData.role === 'creator' ? '/creator' : '/dashboard')
    } catch (err) {
      console.error('Register error:', err)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Create Account</h1>
        <p className="login-subtitle">Join Sessions Marketplace</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            placeholder="your@email.com"
            disabled={isLoading}
            required
          />

          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={formErrors.username}
            placeholder="Choose a username"
            disabled={isLoading}
            required
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
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            error={formErrors.password2}
            placeholder="Re-enter your password"
            disabled={isLoading}
            required
          />

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Account Type
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              <option value="user">User (book sessions)</option>
              <option value="creator">Creator (host sessions)</option>
            </select>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            size="lg"
            style={{ width: '100%' }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="login-footer">
          <p style={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#667eea', fontWeight: '600' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
