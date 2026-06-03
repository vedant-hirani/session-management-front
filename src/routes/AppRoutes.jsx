import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Placeholder — pages will be imported here as they are built
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Sessions Marketplace — Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}
