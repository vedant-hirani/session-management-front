import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Button from '../../../components/ui/Button'
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
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.username) errors.username = 'Username is required'
    if (!formData.password) errors.password = 'Password is required'
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
      await login(formData.username, formData.password)
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Sessions Marketplace</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={formErrors.username}
            placeholder="Enter your username"
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
            placeholder="Enter your password"
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            isLoading={isLoading}
            size="lg"
            style={{ width: '100%' }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="login-footer">
          <p>
            Test Accounts:<br />
            Creator: creator1 / creator123<br />
            User: testuser / user123
          </p>
        </div>
      </div>
    </div>
  )
}
