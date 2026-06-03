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

  const handleRetry = () => {
    listSessions({ search: debouncedSearch })
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
            <p>Loading sessions...</p>
          </div>
        ) : error && !sessions.length ? (
          <div className="sessions-error-state">
            <div className="error-icon">⚠️</div>
            <h2>Unable to Load Sessions</h2>
            <p>We're having trouble connecting to our services. Please try again.</p>
            <button onClick={handleRetry} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="sessions-empty">
            <p>No sessions found</p>
            {searchTerm && <p className="empty-subtitle">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
        
        {error && sessions.length > 0 && (
          <div className="sessions-warning">
            <p>Some sessions couldn&apos;t be loaded. Showing available results.</p>
          </div>
        )}
      </div>
    </div>
  )
}
