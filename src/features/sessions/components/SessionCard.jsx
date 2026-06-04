import React from 'react'
import { Link } from 'react-router-dom'
import './SessionCard.css'

export default function SessionCard({ session }) {
  const initials = session.creator?.first_name?.charAt(0) || session.creator?.username?.charAt(0) || 'C'

  return (
    <div className="premium-session-card-v2">
      {/* Thumbnail Banner */}
      <div className="session-card-banner">
        {session.cover_image ? (
          <img src={session.cover_image} alt={session.title} className="banner-img" />
        ) : (
          <div className="banner-placeholder">🎓</div>
        )}
        <div className="category-tag-badge">{session.category || 'Tech'}</div>
        <div className="price-tag-badge">${session.price}</div>
      </div>

      {/* Main Content */}
      <div className="session-card-body-v2">
        <h3 className="session-card-title-v2">
          <Link to={`/sessions/${session.id}`}>{session.title}</Link>
        </h3>

        {/* Creator Info Grid */}
        <div className="session-creator-meta-grid">
          <div className="creator-avatar-bubble-v2">
            {session.creator?.avatar ? (
              <img src={session.creator.avatar} alt="" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="creator-cred-block">
            <strong>{session.creator?.first_name || session.creator?.username || 'Expert Leader'}</strong>
            <span>{session.creator?.role === 'creator' ? 'Verified Mentor' : 'Contributor'}</span>
          </div>
        </div>

        {/* Meta Stats row */}
        <div className="session-stats-specs-row">
          <span className="spec-pill-item">★ {session.rating || '4.9'}</span>
          <span className="spec-pill-item">⏱ {session.duration_minutes || '60'} mins</span>
          <span className="spec-pill-item">🔥 {session.spots_remaining} left</span>
        </div>

        {/* Credibility booking counter */}
        <div className="session-credibility-bookings">
          <span>🎯 {session.booking_count || '120'}+ successful sessions hosted</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="session-card-footer-v2">
        <Link to={`/sessions/${session.id}`} className="cta-btn-view-details">Details</Link>
        <Link to={`/sessions/${session.id}`} className="cta-btn-book-now">Book Now →</Link>
      </div>
    </div>
  )
}
