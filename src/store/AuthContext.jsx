import React, { createContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/auth.service'
import { setTokens, clearTokens, hasTokens } from '../utils/tokenStorage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null)

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        if (hasTokens()) {
          const profile = await authService.getProfile()
          setUser(profile)
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        clearTokens()
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(async (username, password) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await authService.login(username, password)
      setTokens(data.access, data.refresh)
      const profile = await authService.getProfile()
      setUser(profile)
      setIsAuthenticated(true)
      return profile
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed'
      setError(message)
      setIsAuthenticated(false)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email, username, password, password2, role = 'user') => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await authService.register({ email, username, password, password2, role })
      setTokens(data.access, data.refresh)
      const profile = await authService.getProfile()
      setUser(profile)
      setIsAuthenticated(true)
      return profile
    } catch (err) {
      const message = err.response?.data?.detail || err.response?.data?.email?.[0] || err.response?.data?.username?.[0] || err.response?.data?.password?.[0] || 'Registration failed'
      setError(message)
      setIsAuthenticated(false)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearTokens()
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (profileData) => {
    try {
      setIsLoading(true)
      setError(null)
      const updatedProfile = await authService.updateProfile(profileData)
      setUser(updatedProfile)
      return updatedProfile
    } catch (err) {
      const message = err.response?.data?.detail || 'Profile update failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const switchRole = useCallback(async (role) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await authService.switchRole(role)
      if (data.access) {
        setTokens(data.access, data.refresh)
      }
      setUser(data)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Role switch failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    switchRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
