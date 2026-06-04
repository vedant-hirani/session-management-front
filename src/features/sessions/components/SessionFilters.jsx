import React from 'react'
import './SessionFilters.css'

export default function SessionFilters({
  search,
  priceRange,
  duration,
  sortBy,
  onSearch,
  onPriceChange,
  onDurationChange,
  onSortChange,
  onClear
}) {
  return (
    <div className="premium-sessions-filter-bar">
      {/* Search Field */}
      <div className="filter-input-search-wrapper">
        <input
          type="text"
          placeholder="Search topics, creators, categories..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="filter-search-input-v2"
        />
      </div>

      {/* Select Dropdowns */}
      <div className="filter-selects-group-v2">
        <div className="select-wrapper-v2">
          <select value={priceRange} onChange={(e) => onPriceChange(e.target.value)} className="filter-dropdown-v2">
            <option value="All">All Prices</option>
            <option value="Free">Free</option>
            <option value="Under $50">Under $50</option>
            <option value="$50 - $100">$50 - $100</option>
            <option value="Over $100">Over $100</option>
          </select>
        </div>

        <div className="select-wrapper-v2">
          <select value={duration} onChange={(e) => onDurationChange(e.target.value)} className="filter-dropdown-v2">
            <option value="All">All Durations</option>
            <option value="30">30 Mins</option>
            <option value="60">60 Mins</option>
            <option value="90">90 Mins</option>
          </select>
        </div>

        <div className="select-wrapper-v2">
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="filter-dropdown-v2">
            <option value="newest">Sort: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <button className="btn-clear-filters-v2" onClick={onClear}>
          Reset
        </button>
      </div>
    </div>
  )
}
