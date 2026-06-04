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
      <div className="detail-loading-wrapper">
        <Spinner size="lg" />
        <p>Fetching session experience...</p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="detail-error-state-wrapper">
        <div className="error-icon-box">⚠️</div>
        <h2>Session Not Found</h2>
        <p>The requested session is unavailable or may have been moved by the creator.</p>
        <Button onClick={() => navigate('/sessions')}>Explore Other Sessions</Button>
      </div>
    )
  }

  const isPast = new Date(session.scheduled_at) < new Date()
  const isOwner = isAuthenticated && user && session.creator?.id === user.id

  // Generate customized learning outcomes based on category or tags, fallback to general ones
  const defaultOutcomes = [
    "Practical step-by-step guidance tailored to your experience level.",
    "Interactive Q&A session to troubleshoot your specific blockers.",
    "Access to exclusive templates, recommended resources, and references.",
    "Recording of the live video session for your lifetime access."
  ]

  // Default Agenda based on duration
  const defaultAgenda = [
    { time: "00:00 - 00:10", title: "Introductions & Goal Alignment", desc: "Aligning on key objectives for today's session." },
    { time: "00:10 - 00:35", title: "Deep Dive Core Concepts", desc: "Step-by-step interactive breakdown of the main topic areas." },
    { time: "00:35 - 00:50", title: "Practical Exercises & Implementation", desc: "Collaborative walkthrough of a real-world scenario." },
    { time: "00:50 - 01:00", title: "Q&A and Next Action Steps", desc: "Clarifications, additional resources, and personalized recommendations." }
  ]

  // Default Mock Reviews
  const mockReviews = [
    {
      id: 1,
      author: "Alex Morgan",
      role: "Senior Software Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80",
      rating: 5,
      comment: "Absolutely game-changing session. The hands-on tips shared were exactly what I needed to unblock my team's project. Highly recommend booking!",
      date: "2 weeks ago"
    },
    {
      id: 2,
      author: "Sarah Jenkins",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&fit=crop&q=80",
      rating: 5,
      comment: "Super clear explanations. Explained complex concepts very simply, and provided great actionable frameworks.",
      date: "1 month ago"
    }
  ]

  return (
    <div className="premium-detail-page">
      {/* Top Banner Navigation */}
      <div className="detail-navigation-bar">
        <button className="back-link" onClick={() => navigate('/sessions')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Sessions
        </button>
      </div>

      <div className="detail-grid-container">
        {/* Left main content column */}
        <div className="detail-primary-content">
          
          {/* Cover image area */}
          <div className="premium-detail-hero">
            {session.cover_image ? (
              <img src={session.cover_image} alt={session.title} className="hero-cover-img" />
            ) : (
              <div className="hero-cover-fallback">
                <span className="fallback-badge">{session.category || "Masterclass"}</span>
                <span className="fallback-icon">🎓</span>
              </div>
            )}
          </div>

          {/* Session Header Details */}
          <div className="premium-detail-header">
            <div className="header-meta-row">
              <span className="premium-category-tag">{session.category || "General Session"}</span>
              <div className="header-badges-wrap">
                {isPast && <Badge variant="secondary">Past Session</Badge>}
                {session.spots_remaining === 0 && <Badge variant="danger">Sold Out</Badge>}
                {session.already_booked && <Badge variant="success">Booked ✓</Badge>}
                <Badge variant="primary">{session.status}</Badge>
              </div>
            </div>
            
            <h1 className="premium-detail-title">{session.title}</h1>

            <div className="quick-info-strip">
              <div className="strip-item">
                <svg className="strip-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{session.duration_minutes} Mins Duration</span>
              </div>
              <div className="strip-item">
                <svg className="strip-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{session.spots_remaining} / {session.max_attendees} Seats Left</span>
              </div>
              {session.rating && (
                <div className="strip-item rating">
                  <svg className="strip-icon star" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{parseFloat(session.rating).toFixed(1)} Rating</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="detail-content-section">
            <h2 className="section-title">About the Session</h2>
            <div className="section-body description-text">
              {session.description}
            </div>
          </div>

          {/* Learning Outcomes Section */}
          <div className="detail-content-section">
            <h2 className="section-title">What you'll walk away with</h2>
            <div className="outcomes-grid">
              {defaultOutcomes.map((outcome, idx) => (
                <div key={idx} className="outcome-card">
                  <div className="outcome-icon-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p className="outcome-text">{outcome}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda Section */}
          <div className="detail-content-section">
            <h2 className="section-title">Session Agenda</h2>
            <div className="agenda-timeline">
              {defaultAgenda.map((item, idx) => (
                <div key={idx} className="timeline-node">
                  <div className="timeline-marker">
                    <div className="marker-dot"></div>
                    {idx !== defaultAgenda.length - 1 && <div className="marker-line"></div>}
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-time">{item.time}</span>
                    <h4 className="timeline-title">{item.title}</h4>
                    <p className="timeline-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creator Profile Section */}
          <div className="detail-content-section creator-profile-box">
            <h2 className="section-title">Meet your Host</h2>
            <div className="creator-card-expanded">
              <div className="creator-card-header">
                <div className="creator-profile-avatar">
                  {session.creator?.avatar ? (
                    <img src={session.creator.avatar} alt={session.creator.username} />
                  ) : (
                    <span>{session.creator?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="creator-header-info">
                  <h3 className="creator-fullname">
                    {session.creator?.first_name || session.creator?.username} {session.creator?.last_name || ''}
                  </h3>
                  {session.creator?.headline && (
                    <p className="creator-headline-text">
                      {session.creator.headline}
                      {session.creator.company && <span className="creator-company"> @ {session.creator.company}</span>}
                    </p>
                  )}
                  <div className="creator-trust-badges">
                    <span className="trust-badge">★ Professional Host</span>
                    {session.booking_count > 0 && (
                      <span className="trust-badge">⚡ {session.booking_count}+ sessions held</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="creator-card-bio">
                <p>{session.creator?.bio || "No biography provided by the host."}</p>
              </div>
            </div>
          </div>

          {/* Reviews / Testimonials */}
          <div className="detail-content-section">
            <h2 className="section-title">Participant Feedback</h2>
            <div className="reviews-list">
              {mockReviews.map((review) => (
                <div key={review.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <img src={review.avatar} alt={review.author} className="reviewer-avatar" />
                    <div className="reviewer-info">
                      <div className="reviewer-name-row">
                        <span className="reviewer-name">{review.author}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <span className="reviewer-role">{review.role}</span>
                    </div>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="star-icon" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <p className="testimonial-comment">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags List */}
          {session.tags && session.tags.length > 0 && (
            <div className="detail-content-section tag-wrapper">
              <h3 className="section-subtitle">Tags</h3>
              <div className="tags-container">
                {session.tags.map((tag) => (
                  <span key={tag} className="premium-tag-badge">#{tag}</span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right side booking card column */}
        <div className="detail-sidebar-content">
          <div className="sticky-booking-sidebar">
            <div className="booking-price-header">
              <span className="price-label">Price per person</span>
              <div className="price-tag-row">
                <span className="price-currency">$</span>
                <span className="price-amount">{session.price}</span>
                <span className="price-suffix">/ session</span>
              </div>
            </div>

            {bookingError && <div className="booking-error-notification">{bookingError}</div>}

            <div className="booking-action-wrap">
              {(() => {
                if (isOwner) {
                  return (
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={() => navigate(`/creator/sessions/${session.id}/edit`)}
                      style={{ width: '100%' }}
                    >
                      Manage Session
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
                      Completed Session
                    </Button>
                  )
                }

                if (session.spots_remaining === 0) {
                  return (
                    <Button disabled size="lg" style={{ width: '100%' }}>
                      Fully Booked
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
                    Reserve Spot
                  </Button>
                )
              })()}
            </div>

            {/* Quick Specs / Booking details */}
            <div className="booking-specs-list">
              <div className="spec-row">
                <span className="spec-label">Session Date</span>
                <span className="spec-val">{formatDateTime(session.scheduled_at)}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Format</span>
                <span className="spec-val">1-on-1 / Small Group Call</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Access</span>
                <span className="spec-val">Lifetime Recording & Docs</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Remaining Spots</span>
                <span className={`spec-val ${session.spots_remaining <= 3 ? 'low-spots' : ''}`}>
                  {session.spots_remaining} / {session.max_attendees} slots left
                </span>
              </div>
            </div>

            {/* Trust and Guarantees Badge */}
            <div className="booking-trust-strip">
              <div className="trust-item">
                <svg className="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Secure checkouts through Stripe</span>
              </div>
              <div className="trust-item">
                <svg className="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15.61V17a2 2 0 0 1-2 2h-4M5 8.39V7a2 2 0 0 1 2-2h4M19 8.39V7a2 2 0 0 0-2-2h-4M5 15.61V17a2 2 0 0 0 2 2h4"/>
                  <polyline points="16 11 12 15 8 11"/>
                  <line x1="12" y1="5" x2="12" y2="15"/>
                </svg>
                <span>Full refund if cancelled up to 24h prior</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
