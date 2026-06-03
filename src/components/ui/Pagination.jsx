import React from 'react'
import './Pagination.css'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const range = 2 // Number of pages to show before and after current page
    
    // Always include first page
    pages.push(1)

    let start = Math.max(2, currentPage - range)
    let end = Math.min(totalPages - 1, currentPage + range)

    if (start > 2) {
      pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push('...')
    }

    // Always include last page
    pages.push(totalPages)

    return pages
  }

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn pagination-nav-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        &larr; Prev
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            )
          }

          return (
            <button
              key={`page-${page}`}
              className={`pagination-btn pagination-num-btn ${
                currentPage === page ? 'active' : ''
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        className="pagination-btn pagination-nav-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        Next &rarr;
      </button>
    </div>
  )
}
