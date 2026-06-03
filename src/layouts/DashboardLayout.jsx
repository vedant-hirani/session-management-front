import React from 'react'
import Sidebar from '../components/navigation/Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout({ children }) {
  return (
    // sidebar--collapsed class is toggled on the <aside> inside Sidebar;
    // DashboardLayout.css uses :has() to shrink the margin automatically.
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
