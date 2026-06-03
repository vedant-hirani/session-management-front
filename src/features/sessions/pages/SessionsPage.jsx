import React, { useEffect, useState } from 'react'
import { useSessions } from '../../../hooks/useSessions'
import { useDebounce } from '../../../hooks/useDebounce'
import Spinner from '../../../components/ui/Spinner'
import Pagination from '../../../components/ui/Pagination'
import SessionCard from '../components/SessionCard'
import SessionFilters from '../components/SessionFilters'
import './SessionsPage.css'

export default function SessionsPage() {
  const { sessions, isLoading, error, listSessions, pagination } = useSessions()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    listSessions({ search: debouncedSearch, page: currentPage })
  }, [debouncedSearch, currentPage, listSessions])

  const handleRetry = () => {
    listSessions({ search: debouncedSearch, page: currentPage })
  }

  return (
    <div className="sessions-page">
      <div className="sessions-header">
        <h1>Discover Sessions</h1>
        <p>Find amazing sessions from talented creators</p>
        {!isLoading && pagination && (
          <p className="results-count">
            {pagination.count} {pagination.count === 1 ? 'session' : 'sessions'} found
          </p>
        )}
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

        {pagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={setCurrentPage}
          />
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
