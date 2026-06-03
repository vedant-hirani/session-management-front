import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setTokens } from '../../../utils/tokenStorage'
import { useAuth } from '../../../hooks/useAuth'
import authService from '../../../services/auth.service'
import Spinner from '../../../components/ui/Spinner'
import './OAuthCallback.css'

/**
 * /auth/callback
 * Django redirects here after Google OAuth with:
 *   ?access=<JWT>&refresh=<JWT>&needs_setup=1  (new user)
 *   ?access=<JWT>&refresh=<JWT>                (returning user)
 *
 * For new users: shows a modal to pick username + role before entering the app.
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()

  const [phase, setPhase] = useState('loading') // loading | setup | error
  const [error, setError] = useState('')
  const [setupData, setSetupData] = useState({ username: '', role: 'user' })
  const [setupErrors, setSetupErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')
    const needsSetup = searchParams.get('needs_setup') === '1'

    if (!access || !refresh) {
      setError('OAuth failed — missing tokens. Please try again.')
      setPhase('error')
      return
    }

    // Store tokens immediately so API calls can use them
    setTokens(access, refresh)

    if (needsSetup) {
      // Prefill username from profile (Google gives us a name)
      authService.getProfile()
        .then((profile) => {
          setSetupData((prev) => ({ ...prev, username: profile.username || '' }))
          setPhase('setup')
        })
        .catch(() => setPhase('setup'))
    } else {
      // Returning user — refresh AuthContext and go straight to dashboard
      refreshProfile()
        .then((profile) => {
          navigate(profile.role === 'creator' ? '/creator' : '/dashboard', { replace: true })
        })
        .catch(() => {
          setError('Failed to load your profile. Please log in again.')
          setPhase('error')
        })
    }
  }, [])

  const handleSetupSubmit = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!setupData.username.trim()) errors.username = 'Username is required'
    else if (setupData.username.length < 3) errors.username = 'At least 3 characters'
    if (Object.keys(errors).length) { setSetupErrors(errors); return }

    try {
      setIsSubmitting(true)
      const data = await authService.oauthSetup(setupData)
      // Replace tokens with freshly-issued ones containing the chosen role
      setTokens(data.access, data.refresh)
      // Sync AuthContext so route guards and sidebar see the updated role
      const profile = await refreshProfile()
      navigate(profile.role === 'creator' ? '/creator' : '/dashboard', { replace: true })
    } catch (err) {
      const detail = err.response?.data?.username?.[0]
        || err.response?.data?.role?.[0]
        || err.response?.data?.detail
        || 'Setup failed. Please try again.'
      setError(detail)
      setIsSubmitting(false)
    }
  }

  /* ── Loading ── */
  if (phase === 'loading') {
    return (
      <div className="oauth-callback">
        <div className="oauth-callback-card">
          <Spinner size="lg" />
          <p className="oauth-callback-msg">Signing you in with Google…</p>
        </div>
      </div>
    )
  }

  /* ── Error ── */
  if (phase === 'error') {
    return (
      <div className="oauth-callback">
        <div className="oauth-callback-card">
          <div className="oauth-callback-icon oauth-callback-icon--error">❌</div>
          <h2>Something went wrong</h2>
          <p className="oauth-callback-msg">{error}</p>
          <button className="oauth-back-btn" onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  /* ── Setup modal (new OAuth users) ── */
  return (
    <div className="oauth-callback">
      <div className="oauth-setup-card">
        <div className="oauth-setup-header">
          <div className="oauth-setup-icon">🎓</div>
          <h1>One last step</h1>
          <p>Choose a username and tell us how you'll use the platform.</p>
        </div>

        {error && <div className="oauth-setup-error">{error}</div>}

        <form onSubmit={handleSetupSubmit} className="oauth-setup-form">
          <div className="oauth-setup-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={setupData.username}
              onChange={(e) => {
                setSetupData((p) => ({ ...p, username: e.target.value }))
                setSetupErrors((p) => ({ ...p, username: '' }))
              }}
              placeholder="e.g. johndoe"
              disabled={isSubmitting}
              autoFocus
            />
            {setupErrors.username && (
              <span className="oauth-setup-field-error">{setupErrors.username}</span>
            )}
          </div>

          <div className="oauth-setup-field">
            <label>I want to…</label>
            <div className="oauth-role-options">
              <label className={`oauth-role-option ${setupData.role === 'user' ? 'oauth-role-option--selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={setupData.role === 'user'}
                  onChange={() => setSetupData((p) => ({ ...p, role: 'user' }))}
                  disabled={isSubmitting}
                />
                <div className="oauth-role-option-content">
                  <span className="oauth-role-icon">👤</span>
                  <div>
                    <strong>Browse &amp; Book</strong>
                    <p>Discover and book sessions from creators</p>
                  </div>
                </div>
              </label>

              <label className={`oauth-role-option ${setupData.role === 'creator' ? 'oauth-role-option--selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="creator"
                  checked={setupData.role === 'creator'}
                  onChange={() => setSetupData((p) => ({ ...p, role: 'creator' }))}
                  disabled={isSubmitting}
                />
                <div className="oauth-role-option-content">
                  <span className="oauth-role-icon">🎙</span>
                  <div>
                    <strong>Host Sessions</strong>
                    <p>Create and manage your own sessions</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="oauth-setup-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Get Started →'}
          </button>
        </form>

        <p className="oauth-setup-note">
          Your role is permanent and cannot be changed after this step.
        </p>
      </div>
    </div>
  )
}
