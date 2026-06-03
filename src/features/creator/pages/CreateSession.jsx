import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSessions } from '../../../hooks/useSessions'
import SessionForm from '../components/SessionForm'
import './CreateSession.css'

export default function CreateSession() {
  const navigate = useNavigate()
  const { createSession, isLoading } = useSessions()
  const [serverErrors, setServerErrors] = useState({})
  const [globalError, setGlobalError] = useState('')

  const handleSubmit = async (formData) => {
    try {
      setGlobalError('')
      setServerErrors({})
      await createSession(formData)
      navigate('/creator/sessions', { state: { successMessage: 'Session created successfully!' } })
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setServerErrors(data.errors)
      } else {
        setGlobalError(data?.detail || 'Failed to create session. Please try again.')
      }
    }
  }

  return (
    <div className="create-session-page">
      <div className="page-header">
        <div className="page-header-left">
          <Link to="/creator/sessions" className="back-link">← Back to Sessions</Link>
          <h1 className="page-title">Create New Session</h1>
          <p className="page-subtitle">Fill in the details below to publish your session</p>
        </div>
      </div>

      {globalError && (
        <div className="alert alert-error">{globalError}</div>
      )}

      <SessionForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Create Session"
        serverErrors={serverErrors}
      />
    </div>
  )
}
