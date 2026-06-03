import React from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/formatDate'
import './SessionCard.css'

export default function SessionCard({ session }) {
  const initials = session.creator?.first_name?.charAt(0) || session.creator?.username?.charAt(0) || 'C'

  return (
    <Link to={`/sessions/${session.id}`} className="session-card">
      <div className="session-image">
        {session.cover_image ? (
          <img src={session.cover_image} alt={session.title} />
        ) : (
          <div className="session-image-placeholder">🎓</div>
        )}
        <div className="session-price">${session.price}</div>
      </div>
      <div className="session-content">
        <h3 className="session-title">{session.title}</h3>
        <div className="session-meta">
          <div className="session-creator">
            <div className="creator-initial">{initials}</div>
            <span>{session.creator?.first_name || 'Creator'}</span>
          </div>
          <Badge variant="primary">{session.status}</Badge>
        </div>
        <p className="session-description">{session.description?.substring(0, 80)}...</p>
        <div className="session-footer">
          <div className="session-info">
            <span>{session.duration_minutes} mins</span>
            <span>•</span>
            <span>{session.spots_remaining} spots left</span>
          </div>
          <span className="session-date">{formatDate(session.scheduled_at)}</span>
        </div>
      </div>
    </Link>
  )
}
