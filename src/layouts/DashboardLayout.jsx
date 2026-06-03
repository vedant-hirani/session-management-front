import React from 'react'
import Sidebar from '../components/navigation/Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  )
}
