import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function PublicRoute({ element }) {
  const { isAuthenticated, isLoading } = useAuth()

  // Don't block login/register during auth init — just show the page.
  // Once auth resolves, if already logged in, redirect away.
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return element
}
