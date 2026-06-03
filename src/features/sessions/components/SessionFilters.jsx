import React, { useState } from 'react'
import Input from '../../../components/ui/Input'
import './SessionFilters.css'

export default function SessionFilters({ onSearch }) {
  const [search, setSearch] = useState('')

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    onSearch(value)
  }

  return (
    <div className="session-filters">
      <Input
        placeholder="Search sessions by title or creator..."
        value={search}
        onChange={handleSearchChange}
        type="text"
      />
    </div>
  )
}
