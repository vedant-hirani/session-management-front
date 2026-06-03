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
  const [bookingError, setBookingError] = useState(null)

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
  }, [id, getSessionDetail])

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setBookingError(null)
      await bookSession(parseInt(id))
      navigate('/bookings')
    } catch (err) {
      setBookingError(err.response?.data?.detail || 'Failed to book session. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="detail-loading">
        <Spinner size="lg" />
        <p>Loading session...</p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="detail-error-state">
        <div className="error-icon">⚠️</div>
        <h2>Session Not Available</h2>
        <p>We couldn&apos;t find this session. It may have been removed or is no longer available.</p>
        <Button onClick={() => navigate('/')}>Back to Sessions</Button>
      </div>
    )
  }

  const isPast = new Date(session.scheduled_at) < new Date()
  const isOwner = isAuthenticated && user && session.creator?.id === user.id

  return (
    <div className="session-detail">
      <div className="detail-container">
        <div className="detail-main">

          {/* Image contained inside the card */}
          <div className="detail-image">
            {session.cover_image ? (
              <img src={session.cover_image} alt={session.title} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem' }}>🎓</div>
            )}
          </div>

          <div className="detail-header">
            <h1>{session.title}</h1>
            <div className="detail-badges">
              {isPast && <Badge variant="secondary">Past Session</Badge>}
              {session.spots_remaining === 0 && <Badge variant="danger">Sold Out</Badge>}
              {session.already_booked && <Badge variant="success">Booked ✓</Badge>}
              <Badge variant="primary">{session.status}</Badge>
            </div>
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
            
            {bookingError && <div className="booking-error-message">{bookingError}</div>}
            
            {(() => {
              if (isOwner) {
                return (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate(`/creator/sessions/${session.id}/edit`)}
                    style={{ width: '100%' }}
                  >
                    Your Session (Edit)
                  </Button>
                )
              }
              
              if (session.already_booked) {
                return (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate('/bookings')}
                    style={{ width: '100%' }}
                  >
                    Already Booked ✓
                  </Button>
                )
              }

              if (isPast) {
                return (
                  <Button disabled size="lg" style={{ width: '100%' }}>
                    Past Session
                  </Button>
                )
              }

              if (session.spots_remaining === 0) {
                return (
                  <Button disabled size="lg" style={{ width: '100%' }}>
                    Sold Out
                  </Button>
                )
              }

              return (
                <Button
                  size="lg"
                  onClick={handleBook}
                  isLoading={bookingLoading}
                  style={{ width: '100%' }}
                >
                  Book Now
                </Button>
              )
            })()}

            {session.spots_remaining > 0 ? (
              <p className={`spots-info ${session.spots_remaining <= 3 ? 'spots-urgency' : ''}`}>
                {session.spots_remaining <= 3 ? (
                  <span>⚠️ Only {session.spots_remaining} spots left!</span>
                ) : (
                  <span>{session.spots_remaining} spots remaining</span>
                )}
              </p>
            ) : (
              <p className="spots-info spots-soldout">This session is completely full</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
