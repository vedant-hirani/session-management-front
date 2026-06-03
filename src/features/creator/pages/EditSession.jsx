import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSessions } from '../../../hooks/useSessions'
import SessionForm from '../components/SessionForm'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'
import ConfirmModal from '../../../components/ui/ConfirmModal'
import './CreateSession.css'

export default function EditSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSessionDetail, updateSession, deleteSession, isLoading } = useSessions()
  const [session, setSession] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [serverErrors, setServerErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await getSessionDetail(id)
        setSession(data)
      } catch (err) {
        setLoadError(err.response?.data?.detail || 'Failed to load session')
      }
    }
    loadSession()
  }, [id])

  const handleSubmit = async (formData) => {
    try {
      setGlobalError('')
      setServerErrors({})
      await updateSession(id, formData)
      navigate('/creator/sessions', { state: { successMessage: 'Session updated successfully!' } })
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setServerErrors(data.errors)
      } else {
        setGlobalError(data?.detail || 'Failed to update session. Please try again.')
      }
    }
  }

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false)
    try {
      setIsDeleting(true)
      await deleteSession(id)
      navigate('/creator/sessions', { state: { successMessage: 'Session deleted successfully.' } })
    } catch (err) {
      setGlobalError(err.response?.data?.detail || 'Failed to delete session.')
      setIsDeleting(false)
    }
  }

  if (isLoading && !session) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="create-session-page">
        <div className="alert alert-error">{loadError}</div>
        <Link to="/creator/sessions"><Button>Back to Sessions</Button></Link>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="create-session-page">
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete this session?"
        message="This will soft-delete the session and cancel all confirmed bookings with refunds. This cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Session"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <div className="page-header">
        <div className="page-header-left">
          <Link to="/creator/sessions" className="back-link">← Back to Sessions</Link>
          <h1 className="page-title">Edit Session</h1>
          <p className="page-subtitle">Update your session details below</p>
        </div>
        <Button
          variant="danger"
          onClick={() => setShowDeleteConfirm(true)}
          isLoading={isDeleting}
          disabled={isLoading}
        >
          {isDeleting ? 'Deleting...' : 'Delete Session'}
        </Button>
      </div>

      {globalError && <div className="alert alert-error">{globalError}</div>}

      <SessionForm
        initialData={session}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Update Session"
        serverErrors={serverErrors}
      />
    </div>
  )
}
