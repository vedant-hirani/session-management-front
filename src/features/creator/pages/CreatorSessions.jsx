import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSessions } from '../../../hooks/useSessions'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Pagination from '../../../components/ui/Pagination'
import { formatDate } from '../../../utils/formatDate'
import './CreatorSessions.css'

export default function CreatorSessions() {
  const { sessions, isLoading, error, getMySessions, pagination } = useSessions()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getMySessions({ page: currentPage })
  }, [currentPage, getMySessions])

  return (
    <div className="creator-sessions">
      <div className="sessions-header">
        <h1>Your Sessions</h1>
        <Link to="/creator/sessions/new">
          <Button>Create New Session</Button>
        </Link>
      </div>

      <div className="sessions-content">
        {isLoading ? (
          <div className="loading">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="empty">
            <p>No sessions created yet</p>
            <Link to="/creator/sessions/new">
              <Button>Create First Session</Button>
            </Link>
          </div>
        ) : (
          <div className="sessions-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Attendees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.title}</td>
                    <td>${session.price}</td>
                    <td>{formatDate(session.scheduled_at)}</td>
                    <td>{session.max_attendees - session.spots_remaining} / {session.max_attendees}</td>
                    <td><Badge variant="primary">{session.status}</Badge></td>
                    <td className="actions">
                      <Link to={`/creator/sessions/${session.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}
