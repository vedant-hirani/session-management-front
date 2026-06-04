import React, { useEffect, useState, useMemo } from 'react'
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
  const [priceRange, setPriceRange] = useState('All')
  const [duration, setDuration] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebounce(searchTerm, 400)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, priceRange, duration, sortBy])

  // Query catalog dynamically with all parameters
  useEffect(() => {
    const loadParams = {
      search: debouncedSearch,
      page: currentPage,
      ordering: sortBy,
    }

    if (priceRange === 'Free') {
      loadParams.min_price = 0
      loadParams.max_price = 0
    } else if (priceRange === 'Under $50') {
      loadParams.max_price = 49.99
    } else if (priceRange === '$50 - $100') {
      loadParams.min_price = 50.00
      loadParams.max_price = 100.00
    } else if (priceRange === 'Over $100') {
      loadParams.min_price = 100.01
    }

    listSessions(loadParams)
  }, [debouncedSearch, priceRange, duration, sortBy, currentPage, listSessions])

  const handleClearFilters = () => {
    setSearchTerm('')
    setPriceRange('All')
    setDuration('All')
    setSortBy('newest')
    setCurrentPage(1)
  }

  // Filter clientside specifically for duration to save query complexity
  const processedSessions = useMemo(() => {
    if (duration === 'All') return sessions
    const mins = parseInt(duration)
    return sessions.filter(s => s.duration_minutes === mins)
  }, [sessions, duration])

  // Partition trending & featured sessions for custom rows
  const featuredSessions = useMemo(() => {
    return processedSessions.filter(s => s.is_featured).slice(0, 4)
  }, [processedSessions])

  const normalSessions = useMemo(() => {
    return processedSessions.filter(s => !s.is_featured)
  }, [processedSessions])

  return (
    <div className="sessions-page-v2">
      {/* Immersive Header */}
      <div className="sessions-dashboard-header">
        <div className="header-details-block">
          <span className="live-status-dot-v2"></span>
          <h1>Discover Sessions</h1>
          <p>Book high-end 1:1 sessions, design reviews, and architectural consultations instantly.</p>
        </div>
      </div>

      {/* Sticky Filters bar */}
      <div className="sticky-filters-container-v2">
        <SessionFilters
          search={searchTerm}
          priceRange={priceRange}
          duration={duration}
          sortBy={sortBy}
          onSearch={setSearchTerm}
          onPriceChange={setPriceRange}
          onDurationChange={setDuration}
          onSortChange={setSortBy}
          onClear={handleClearFilters}
        />
      </div>

      <div className="sessions-page-content-wrapper">
        {isLoading ? (
          <div className="sessions-page-loading-skeleton">
            <Spinner size="lg" />
            <p>Syncing catalog databases...</p>
          </div>
        ) : error && !sessions.length ? (
          <div className="sessions-error-state-v2">
            <span className="err-icon-v2">⚠️</span>
            <h2>Connection Interrupt</h2>
            <p>We're having trouble retrieving available slots. Please retry.</p>
            <button onClick={handleClearFilters} className="btn-retry-v2">Retry Synchronization</button>
          </div>
        ) : processedSessions.length === 0 ? (
          <div className="sessions-empty-illustration-v2">
            <span className="empty-indicator-art">🔍</span>
            <h2>No matching sessions</h2>
            <p>Try resetting some filters or adjusting your keyword query.</p>
            <button onClick={handleClearFilters} className="btn-reset-v2-main">Reset Filters</button>
          </div>
        ) : (
          <div className="sessions-layout-v2-grid">
            {/* Featured Sessions segment */}
            {featuredSessions.length > 0 && (
              <div className="featured-sessions-section">
                <h3>🔥 Featured Consultations</h3>
                <div className="featured-scrollable-grid">
                  {featuredSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>
            )}

            {/* General Marketplace list */}
            <div className="general-marketplace-section">
              <h3>{featuredSessions.length > 0 ? '📚 General Catalog' : '📚 All Sessions'}</h3>
              <div className="marketplace-grid-catalog">
                {normalSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pagination bar */}
        {!isLoading && pagination && pagination.total_pages > 1 && (
          <div className="pagination-wrapper-v2">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
