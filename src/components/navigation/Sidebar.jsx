import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isCreator } from '../../utils/roleHelpers'
import './Sidebar.css'

const USER_NAV = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard', end: true },
  { to: '/sessions', icon: '🎓', label: 'Browse Sessions' },
  { to: '/bookings', icon: '📋', label: 'My Bookings' },
  { to: '/profile', icon: '👤', label: 'Profile' },
]

const CREATOR_NAV = [
  {
    section: 'Creator Dashboard', items: [
      { to: '/creator', icon: '🏠', label: 'Overview', end: true },
      { to: '/creator/sessions', icon: '📚', label: 'My Sessions' },
      { to: '/creator/sessions/new', icon: '➕', label: 'Create Session' },
      { to: '/creator/bookings', icon: '📋', label: 'Session Bookings' },
    ]
  },
  {
    section: 'General', items: [
      { to: '/sessions', icon: '🌐', label: 'Browse All' },
      { to: '/bookings', icon: '🎫', label: 'My Bookings' },
      { to: '/profile', icon: '👤', label: 'Profile' },
    ]
  },
]

export default function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = user
    ? (user.first_name?.[0] || user.username?.[0] || '?').toUpperCase()
    : '?'

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile hamburger */}
      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen(true)}>
        ☰
      </button>

      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-brand">
              <span className="sidebar-brand-icon">🎓</span>
              <span className="sidebar-brand-text">Sessions</span>
            </div>
          )}
          <button
            className="sidebar-collapse-btn"
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false) }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* User info */}
        {isAuthenticated && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {user?.first_name || user?.username}
                </div>
                <div className={`sidebar-role-badge sidebar-role-badge--${user?.role}`}>
                  {user?.role}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {isCreator(user) ? (
            // Creator nav with sections
            CREATOR_NAV.map((section, idx) => (
              <div key={idx}>
                {!collapsed && section.section && (
                  <div className="sidebar-nav-section">{section.section}</div>
                )}
                {section.items.map(({ to, icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? label : undefined}
                  >
                    <span className="sidebar-nav-icon">{icon}</span>
                    {!collapsed && <span className="sidebar-nav-label">{label}</span>}
                  </NavLink>
                ))}
              </div>
            ))
          ) : (
            // Regular user nav (no sections)
            USER_NAV.map(({ to, icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
                title={collapsed ? label : undefined}
              >
                <span className="sidebar-nav-icon">{icon}</span>
                {!collapsed && <span className="sidebar-nav-label">{label}</span>}
              </NavLink>
            ))
          )}
        </nav>

        {/* Footer / Logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
          >
            <span className="sidebar-nav-icon">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
