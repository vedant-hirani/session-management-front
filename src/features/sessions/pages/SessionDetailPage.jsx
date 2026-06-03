import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useBookings } from '../../../hooks/useBookings'
import { useSessions } from '../../../hooks/useSessions'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import Badge from '../../../components/ui/Badge'
import { formatDateTime } from '../../../utils/formatDate'
import './SessionDetailPage.css'

export default function SessionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { getSessionDetail } = useSessions()
  const { bookSession, isLoading: bookingLoading } = useBookings()

  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSession = async () => {
      try {
        setIsLoading(true)
        const data = await getSessionDetail(id)
        setSession(data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load session')
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [id])

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      await bookSession(parseInt(id))
      navigate('/bookings')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to book session')
    }
  }

  if (isLoading) {
    return (
      <div className="detail-loading">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="detail-error">
        <p>{error || 'Session not found'}</p>
        <Button onClick={() => navigate('/')}>Back to Sessions</Button>
      </div>
    )
  }

  return (
    <div className="session-detail">
      <div className="detail-image">
        <img src={session.cover_image} alt={session.title} />
      </div>

      <div className="detail-container">
        <div className="detail-main">
          <div className="detail-header">
            <h1>{session.title}</h1>
            <Badge variant="primary">{session.status}</Badge>
          </div>

          <div className="detail-creator">
            <div className="creator-avatar">
              {session.creator?.avatar ? (
                <img src={session.creator.avatar} alt={session.creator.first_name} />
              ) : (
                <span>{session.creator?.first_name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="creator-name">{session.creator?.first_name} {session.creator?.last_name}</p>
              <p className="creator-bio">{session.creator?.bio}</p>
            </div>
          </div>

          <div className="detail-info">
            <div className="info-item">
              <span className="label">Duration</span>
              <span className="value">{session.duration_minutes} minutes</span>
            </div>
            <div className="info-item">
              <span className="label">Scheduled At</span>
              <span className="value">{formatDateTime(session.scheduled_at)}</span>
            </div>
            <div className="info-item">
              <span className="label">Available Spots</span>
              <span className="value">{session.spots_remaining} / {session.max_attendees}</span>
            </div>
          </div>

          <div className="detail-description">
            <h2>About this session</h2>
            <p>{session.description}</p>
          </div>

          {session.tags && session.tags.length > 0 && (
            <div className="detail-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {session.tags.map((tag) => (
                  <Badge key={tag} variant="success">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="booking-card">
            <div className="price">${session.price}</div>
            {session.spots_remaining > 0 ? (
              <Button
                size="lg"
                onClick={handleBook}
                isLoading={bookingLoading}
                style={{ width: '100%' }}
              >
                Book Now
              </Button>
            ) : (
              <Button disabled size="lg" style={{ width: '100%' }}>
                No Spots Available
              </Button>
            )}
            <p className="spots-info">{session.spots_remaining} spots remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}
