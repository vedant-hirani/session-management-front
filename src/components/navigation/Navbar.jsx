import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isCreator } from '../../utils/roleHelpers'
import Button from '../ui/Button'
import './Navbar.css'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          Sessions
        </Link>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Browse
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/bookings" onClick={() => setMobileMenuOpen(false)}>
                  My Bookings
                </Link>
                {isCreator(user) && (
                  <>
                    <Link to="/creator" onClick={() => setMobileMenuOpen(false)}>
                      Creator Dashboard
                    </Link>
                  </>
                )}
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
              </>
            ) : null}
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <span className="user-greeting">
                  {user?.first_name}
                </span>
                <Button 
                  variant="secondary"
                  onClick={handleLogout}
                  size="sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
