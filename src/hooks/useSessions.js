import { useState, useCallback } from 'react'
import sessionService from '../services/session.service'

export function useSessions() {
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  const listSessions = useCallback(async (params = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await sessionService.listAllSessions(params)
      setSessions(data.results)
      setPagination(data.pagination)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load sessions'
      setError(message)
      setSessions([])
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getSessionDetail = useCallback(async (sessionId) => {
    try {
      setIsLoading(true)
      setError(null)
      const session = await sessionService.getSessionDetail(sessionId)
      return session
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load session'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getMySessions = useCallback(async (params = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await sessionService.getMySessions(params)
      setSessions(data.results)
      setPagination(data.pagination)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load your sessions'
      setError(message)
      setSessions([])
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createSession = useCallback(async (sessionData) => {
    try {
      setIsLoading(true)
      setError(null)
      const session = await sessionService.createSession(sessionData)
      return session
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create session'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSession = useCallback(async (sessionId, sessionData) => {
    try {
      setIsLoading(true)
      setError(null)
      const session = await sessionService.updateSession(sessionId, sessionData)
      return session
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to update session'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancelSession = useCallback(async (sessionId) => {
    try {
      setIsLoading(true)
      setError(null)
      const session = await sessionService.cancelSession(sessionId)
      return session
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to cancel session'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteSession = useCallback(async (sessionId) => {
    try {
      setIsLoading(true)
      setError(null)
      await sessionService.deleteSession(sessionId)
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete session'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchSessions = useCallback(async (query, params = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await sessionService.searchSessions(query, params)
      setSessions(data.results)
      setPagination(data.pagination)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Search failed'
      setError(message)
      setSessions([])
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    sessions,
    isLoading,
    error,
    pagination,
    listSessions,
    getSessionDetail,
    getMySessions,
    createSession,
    updateSession,
    cancelSession,
    deleteSession,
    searchSessions,
  }
}
