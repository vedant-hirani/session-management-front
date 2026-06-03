import React, { useEffect, useState } from 'react'
import { useSessions } from '../../../hooks/useSessions'
import { useDebounce } from '../../../hooks/useDebounce'
import Spinner from '../../../components/ui/Spinner'
import SessionCard from '../components/SessionCard'
import SessionFilters from '../components/SessionFilters'
import './SessionsPage.css'

export default function SessionsPage() {
  const { sessions, isLoading, error, listSessions } = useSessions()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    listSessions({ search: debouncedSearch })
  }, [debouncedSearch])

  if (error && !sessions.length) {
    return (
      <div className="sessions-error">
        <p>Failed to load sessions: {error}</p>
      </div>
    )
  }

  return (
    <div className="sessions-page">
      <div className="sessions-header">
        <h1>Discover Sessions</h1>
        <p>Find amazing sessions from talented creators</p>
      </div>

      <div className="sessions-content">
        <SessionFilters onSearch={setSearchTerm} />

        {isLoading ? (
          <div className="sessions-loading">
            <Spinner size="lg" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="sessions-empty">
            <p>No sessions found</p>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
