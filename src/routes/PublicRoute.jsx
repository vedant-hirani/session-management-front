import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isCreator } from '../utils/roleHelpers'
import Spinner from '../components/ui/Spinner'

export function PublicRoute({ element }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  // While auth is initializing, show a spinner so the login page never
  // flashes for an already-authenticated user.
  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'linear-gradient(145deg,#1a1a2e,#16213e,#0f3460)'
      }}>
        <Spinner />
      </div>
    )
  }

  // Already logged in — send to the right dashboard
  if (isAuthenticated) {
    return <Navigate to={isCreator(user) ? '/creator' : '/dashboard'} replace />
  }

  return element
}
